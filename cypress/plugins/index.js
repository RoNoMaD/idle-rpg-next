const { GitHubSocialLogin } = require("cypress-social-logins").plugins;

module.exports = (on) => {
  on("task", {
    GitHubSocialLogin: GitHubSocialLogin,
  });
};
