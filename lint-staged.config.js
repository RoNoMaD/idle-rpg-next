module.exports = {
  "*.@(ts|tsx)": [
    "npm run format",
    "npm run lint",
    () => " npm run type-check",
    "npx jest --findRelatedTests",
  ],
};
