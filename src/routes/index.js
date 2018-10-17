export default [{
  method: 'GET',
  path: '/',
  config: {
    auth: false,
    handler: async (request, h) => {
      return 'Hello from hapi-starter!'
    }
  }
}]
