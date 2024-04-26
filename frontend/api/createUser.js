import React from 'react'

const createUser = (req, res) => {
  try {
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
