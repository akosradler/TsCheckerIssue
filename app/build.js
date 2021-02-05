"use strict";

process.on("unhandledRejection", (err) => {
  throw err;
});

const fs = require("fs-extra");
const webpack = require("webpack");
const configFactory = require("./webpack.config");

// Generate configuration
const config = configFactory("production");

fs.emptyDirSync("build");
// Merge with the public folder

build();

// Create the production build and print the deployment instructions.
function build() {
  console.log("Creating an optimized production build...");

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }

        let errMessage = err.message;

        messages = {
          errors: [errMessage],
          warnings: [],
        };
      } else {
        messages = stats.toJson({ all: true, warnings: true, errors: true });
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(
          new Error(messages.errors.map((e) => e.message).join("\n\n"))
        );
      }

      const resolveArgs = {
        stats,
        warnings: messages.warnings,
      };

      return resolve(resolveArgs);
    });
  });
}
