// When Webpack cannot resolve these dependencies, it will not print an error message.

import type { Compiler } from 'webpack';

const OPTIONAL_DEPENDENCIES = [
  '@remotion/compositor-win32-x64-msvc',
  '@remotion/compositor-linux-arm64-gnu',
  '@remotion/compositor-linux-arm64-musl',
  '@remotion/compositor-linux-x64-gnu',
  '@remotion/compositor-linux-x64-musl',
  '@remotion/compositor-darwin-x64',
];

const SOURCE_MAP_IGNORE = ['path', 'fs'];

// eslint-disable-next-line import/prefer-default-export
export class AllowOptionalDependenciesPlugin {
  // eslint-disable-next-line class-methods-use-this
  filter(error: Error) {
    // eslint-disable-next-line no-restricted-syntax
    for (const dependency of OPTIONAL_DEPENDENCIES) {
      if (error.message.includes(`Can't resolve '${dependency}'`)) {
        return false;
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const dependency of SOURCE_MAP_IGNORE) {
      if (
        error.message.includes(`Can't resolve '${dependency}'`) &&
        error.message.includes('source-map')
      ) {
        return false;
      }
    }

    return true;
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterCompile.tap('Com', (compilation) => {
      compilation.errors = compilation.errors.filter(this.filter);
    });
    compiler.hooks.afterEmit.tap(
      'AllowOptionalDependenciesPlugin',
      (compilation) => {
        compilation.errors = compilation.errors.filter(this.filter);
        compilation.warnings = compilation.warnings.filter(this.filter);
      },
    );
  }
}
