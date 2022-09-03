async function getFees() {
  const response = await fetch('https://www.etherchain.org/api/gasPriceOracle');
  return response.text();
}

module.exports.onRpcRequest = async ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      // eslint-disable-next-line no-case-declarations
      const fees = JSON.parse(await getFees());
      const baseFee = fees.currentBaseFee;
      const safeLow = Math.ceil(baseFee + parseFloat(fees.safeLow));
      const standard = Math.ceil(baseFee + parseFloat(fees.standard));
      const fastest = Math.ceil(baseFee + parseFloat(fees.fastest));

      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Gas Fees`,
            description: 'Current Gas Fees from etherchain.org:',
            textAreaContent: `Base: ${baseFee} \n Low: ${safeLow} \n Average: ${standard} \n High: ${fastest}`,
          },
        ],
      });
    default:
      throw new Error('Method not found.');
  }
};
