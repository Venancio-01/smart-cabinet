'use strict'; (self.webpackChunk_vue_devtools_shell_chrome = self.webpackChunk_vue_devtools_shell_chrome || []).push([[1569], { 51569: (e, t, s) => { s.r(t), s.d(t, { conf: () => n, language: () => o }); var n = { comments: { lineComment: '#' } }; var o = { defaultToken: 'keyword', ignoreCase: !0, tokenPostfix: '.azcli', str: /[^#\s]/, tokenizer: { root: [{ include: '@comment' }, [/\s-+@str*\s*/, { cases: { '@eos': { token: 'key.identifier', next: '@popall' }, '@default': { token: 'key.identifier', next: '@type' } } }], [/^-+@str*\s*/, { cases: { '@eos': { token: 'key.identifier', next: '@popall' }, '@default': { token: 'key.identifier', next: '@type' } } }]], type: [{ include: '@comment' }, [/-+@str*\s*/, { cases: { '@eos': { token: 'key.identifier', next: '@popall' }, '@default': 'key.identifier' } }], [/@str+\s*/, { cases: { '@eos': { token: 'string', next: '@popall' }, '@default': 'string' } }]], comment: [[/#.*$/, { cases: { '@eos': { token: 'comment', next: '@popall' } } }]] } } } }])
