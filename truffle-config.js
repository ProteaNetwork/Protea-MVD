module.exports = {
  migrations_directory: "./migrations",
  networks: {
    dev: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};
