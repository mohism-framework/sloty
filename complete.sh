#/usr/bin/env bash
_undefined_completions()
{
  COMPREPLY=($(compgen -W "" "${COMP_WORDS[1]}"))
}

complete -F _undefined_completions undefined
