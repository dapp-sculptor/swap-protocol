require('dotenv').config();

const { ethers } = require('ethers')

// RPC
const polygonRPC = process.env.POLYGON_RPC
const polygonProvider = new ethers.JsonRpcProvider(polygonRPC)


// ADDRESS
const swapRouterAddress = '0xe592427a0aece92de3edee1f18e0157c05861564'
const swapRouterV2Address = '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45'
const uniswapV3FactoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const uniswapV2FactoryAddress = '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32'
const quoterContractAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
const permitAddress = '0x000000000022D473030F116dDEE9F6B43aC78BA3'
const ZERO = '0x0000000000000000000000000000000000000000'
const WMATIC = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
const DIMO = '0xe261d618a959afffd53168cd07d12e37b26761db'
const UNIM = '0x64060aB139Feaae7f06Ca4E63189D86aDEb51691'

// FEE
const feeAmount = {
  LOWEST: 100,
  LOW: 500,
  MEDIUM: 3000,
  HIGH: 10000
}

const privateKey = process.env.PRIVATE_KEY

module.exports = {
  polygonRPC,
  polygonProvider,
  swapRouterAddress,
  uniswapV3FactoryAddress,
  quoterContractAddress,
  permitAddress,
  feeAmount,
  privateKey,
  ZERO,
  WMATIC,
  DIMO,
  UNIM,
  swapRouterV2Address,
  uniswapV2FactoryAddress
}