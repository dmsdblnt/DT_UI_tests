/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file.js');
type ChaiWrapper = import('codeceptjs-chai');
type MailSlurp = import('@codeceptjs/mailslurp-helper');

declare namespace CodeceptJS {
  interface SupportObject { I: CodeceptJS.I }
  interface CallbackOrder { [0]: CodeceptJS.I }
  interface Methods extends CodeceptJS.Playwright, ChaiWrapper, MailSlurp {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}
