const { ethers } = require('ethers')
const { SwapRouterABI, UniSwapV3FactoryABI, UniSwapV3PoolABI, ERC20ABI, QuoterABI, WMATICABI, UniSwapV2FactoryABI, UniSwapV2RouterABI } = require('./abi.json')
const { polygonRPC, polygonProvider, swapRouterAddress, feeAmount, uniswapV3FactoryAddress, quoterContractAddress, privateKey, ZERO, WMATIC, permitAddress, UNIM, DIMO, uniswapV2FactoryAddress, swapRouterV2Address } = require('./config')

const wallet = new ethers.Wallet(privateKey, polygonProvider);

// INPUT DATA
const inputAmount = 0.1
const inputTokenAddress = UNIM
const outputTokenAddress = DIMO

const swapV3 = async () => {
  try {
    const swapRouterContract = new ethers.Contract(
      swapRouterAddress,
      SwapRouterABI,
      wallet
    )

    const uniswapV3FactoryContract = new ethers.Contract(
      uniswapV3FactoryAddress,
      UniSwapV3FactoryABI,
      polygonProvider
    )

    const value = ethers.parseEther(inputAmount.toString())

    const inputToken = new ethers.Contract(
      inputTokenAddress,
      ERC20ABI,
      wallet
    )

    const outputToken = new ethers.Contract(
      outputTokenAddress,
      ERC20ABI,
      wallet
    )

    const poolAddress = await uniswapV3FactoryContract.getPool(inputTokenAddress, outputTokenAddress, feeAmount.MEDIUM)

    if (poolAddress == ZERO) {
      const poolA = await uniswapV3FactoryContract.getPool(inputTokenAddress, WMATIC, feeAmount.MEDIUM)
      const poolB = await uniswapV3FactoryContract.getPool(outputTokenAddress, WMATIC, feeAmount.MEDIUM)
      console.log(poolA, poolB)

      const path = ethers.solidityPackedKeccak256(["address", "uint256", "address", "uint256", "address"], [inputTokenAddress, feeAmount.MEDIUM.toString(), WMATIC, feeAmount.MEDIUM.toString(), outputTokenAddress])

      // const path = ethers.solidityPacked(["address", "address", "address"], [inputTokenAddress, WMATIC, outputTokenAddress])

      const approveTx = await inputToken.approve(swapRouterAddress, value)
      await approveTx.wait()

      const options = {
        gasLimit: 40000,
        gasPrice: ethers.parseUnits('10001', 'gwei'),
        nounce: await polygonProvider.getTransactionCount(wallet.address)
      }

      const deadline = Math.floor(Date.now() / 1000) + (60 * 10)

      const result = await swapRouterContract.exactInput(
        path,
        wallet.address,
        deadline,
        value,
        0,
        options
      )
    } else {
      const quoterContract = new ethers.Contract(
        quoterContractAddress,
        QuoterABI,
        wallet
      )

      const poolContract = new ethers.Contract(poolAddress, UniSwapV3PoolABI, wallet)

      // const quotedAmountOut = await quoterContract.quoteExactInputSingle(
      //   inputTokenAddress,
      //   outputTokenAddress,
      //   feeAmount.HIGH,
      //   ethers.parseUnits(inputAmount.toString(), 18),
      //   0
      // )

      const options = {
        gasLimit: 500001,
        gasPrice: ethers.parseUnits('1001', 'gwei'),
        nounce: await polygonProvider.getTransactionCount(wallet.address)
      }

      if (inputTokenAddress == WMATIC) options.value = value

      const deadline = Math.floor(Date.now() / 1000) + (60 * 1)

      const approveTx = await inputToken.approve(swapRouterAddress, value)
      await approveTx.wait()

      const result = await swapRouterContract.exactInputSingle(
        inputTokenAddress,
        outputTokenAddress,
        feeAmount.HIGH,
        wallet.address,
        deadline,
        value,
        0,
        0,
        options
      )
      await result.wait()
    }
  } catch (e) {
    console.log(e)
  }
}

const swapv2 = async () => {
  const uniswapV2FactoryContract = new ethers.Contract(
    uniswapV2FactoryAddress,
    UniSwapV2FactoryABI,
    polygonProvider
  )
  const uniswapV2RouterContract = new ethers.Contract(
    swapRouterV2Address,
    UniSwapV2RouterABI,
    wallet
  )

  const value = ethers.parseEther(inputAmount.toString())

  const inputToken = new ethers.Contract(
    inputTokenAddress,
    ERC20ABI,
    wallet
  )

  const outputToken = new ethers.Contract(
    outputTokenAddress,
    ERC20ABI,
    wallet
  )

  const poolAddress = await uniswapV2FactoryContract.getPair(inputTokenAddress, outputTokenAddress)

  if (poolAddress == ZERO) {
    const approveTx = await inputToken.approve(swapRouterV2Address, value)
    await approveTx.wait()

    const options = {
      gasLimit: 420000n,
      gasPrice: ethers.parseUnits('100000', 'wei'),
      nounce: await polygonProvider.getTransactionCount(wallet.address)
    }

    const result = await uniswapV2RouterContract.swapExactTokensForTokens(
      value,
      0n,
      [inputTokenAddress, WMATIC, outputTokenAddress],
      wallet.address,
      options
    )

    await result.wait()
    console.log(result)
  } else {
    const options = {
      gasLimit: 500001,
      gasPrice: ethers.parseUnits('100001', 'gwei'),
      nounce: await polygonProvider.getTransactionCount(wallet.address)
    }

    if (inputTokenAddress == WMATIC) options.value = value

    const deadline = Math.floor(Date.now() / 1000) + (60 * 1)

    const approveTx = await inputToken.approve(swapRouterAddress, value)
    await approveTx.wait()

    const result = await uniswapV2RouterContract.swapExactTokensForTokens(
      inputTokenAddress,
      outputTokenAddress,
      feeAmount.HIGH,
      wallet.address,
      deadline,
      value,
      0,
      0,
      options
    )

    await result.wait()
    console.log(result)
  }
}