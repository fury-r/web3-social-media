const createUser = (req, res) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const userDoc = {
      _type: 'users',
      _id: req.body.walletAddress,
      username: 'unnamed',
      address: req.body.walletAddress
    }
  } catch (error) {
    res.status(500).send({ message: 'error', data: error.message })
  }
}
export default createUser
