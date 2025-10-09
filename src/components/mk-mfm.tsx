/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ClockIcon } from 'lucide-react'
import * as mfm from 'mfm-js'
import * as Misskey from 'misskey-js'
import type { CSSProperties } from 'react'
import { MkCustomEmoji, MkEmoji } from './mk-emoji'
import { MkHashTag } from './mk-hashtag'
import { MkMention } from './mk-mention'
import { MkUrl } from './mk-url'

function safeParseFloat(str: unknown): number | null {
  if (typeof str !== 'string' || str === '') return null
  const num = parseFloat(str)
  if (Number.isNaN(num)) return null
  return num
}

type MfmProps = {
  text: string
  plain?: boolean
  inline?: boolean
  nowrap?: boolean
  author?: Misskey.entities.UserLite
  isNote?: boolean
  emojiUrls?: Record<string, string>
  rootScale?: number
  nyaize?: boolean | 'respect'
  parsedNodes?: mfm.MfmNode[] | null
  enableEmojiMenu?: boolean
  enableEmojiMenuReaction?: boolean
  isAnim?: boolean
  isBlock?: boolean
  linkNavigationBehavior?: unknown
  clickEv?: (clickEv: string) => void
}

const defaultStore = {
  state: {
    advancedMfm: true,
  },
}

const validTime = (t: string | boolean | null | undefined) => {
  if (t == null) return null
  if (typeof t === 'boolean') return null
  return t.match(/^-?[0-9.]+s$/) ? t : null
}

const validColor = (c: unknown): string | null => {
  if (typeof c !== 'string') return null
  return c.match(/^[0-9a-f]{3,6}$/i) ? c : null
}

export const MkMfm = (in_props: MfmProps) => {
  const props: MfmProps = {
    isNote: true,
    emojiUrls: {},
    author: undefined,
    rootScale: undefined,
    nyaize: 'respect',
    parsedNodes: undefined,
    linkNavigationBehavior: undefined,
    ...in_props,
  }

  // const host = null;
  const shouldNyaize = true
  const useAnim = true
  const rootAst = (props.plain ? mfm.parseSimple : mfm.parse)(props.text)

  if (props.text == null || props.text === '') return

  const classList = ['mfm']
  if (props.isBlock) classList.push('block')
  if (props.inline) classList.push('mfm-inline')

  const genEl = (ast: mfm.MfmNode[], scale: number, disableNyaize = false) =>
    ast.map((token): React.ReactNode => {
      switch (token.type) {
        case 'text': {
          let text = token.props.text.replace(/(\r\n|\n|\r)/g, '\n')
          if (!disableNyaize && shouldNyaize) {
            text = Misskey.nyaize(text)
          }

          if (!props.plain && !props.inline) {
            return (
              <>
                {text.split('\n').map((t, i) => (
                  <>
                    {i > 0 && <br />}
                    {t}
                  </>
                ))}
              </>
            )
          }
          else {
            return <>{text.replace(/\n/g, ' ')}</>
          }
        }
        case 'bold':
          return <b>{genEl(token.children, scale)}</b>
        case 'strike':
          return <del>{genEl(token.children, scale)}</del>
        case 'italic':
          return <i style={{ fontStyle: 'oblique' }}>{genEl(token.children, scale)}</i>

        case 'fn': {
          // TODO: CSSを文字列で組み立てていくと token.props.args.~~~ 経由でCSSインジェクションできるのでよしなにやる
          let style: CSSProperties | undefined
          switch (token.props.name) {
            case 'tada': {
              const speed = validTime(token.props.args.speed) ?? '1s'
              const delay = validTime(token.props.args.delay) ?? '0s'
              style = {
                fontSize: '150%',
                ...(useAnim
                  ? {
                      animation: `global-tada ${speed} linear infinite both`,
                      animationDelay: delay,
                    }
                  : {}),
              }
              break
            }
            case 'jelly': {
              const speed = validTime(token.props.args.speed) ?? '1s'
              const delay = validTime(token.props.args.delay) ?? '0s'
              style = {
                animation: `mfm-rubberBand ${speed} linear infinite both`,
                animationDelay: delay,
              }
              break
            }
            case 'twitch': {
              const speed = validTime(token.props.args.speed) ?? '0.5s'
              const delay = validTime(token.props.args.delay) ?? '0s'
              style = useAnim
                ? {
                    animation: `mfm-twitch ${speed} ease infinite`,
                    animationDelay: delay,
                  }
                : {}
              break
            }
            case 'shake': {
              const speed = validTime(token.props.args.speed) ?? '0.5s'
              const delay = validTime(token.props.args.delay) ?? '0s'
              style = useAnim
                ? {
                    animation: `mfm-shake ${speed} ease infinite`,
                    animationDelay: delay,
                  }
                : {}
              break
            }
            case 'spin': {
              const direction = token.props.args.left ? 'reverse' : token.props.args.alternate ? 'alternate' : 'normal'
              const anime = token.props.args.x ? 'mfm-spinX' : token.props.args.y ? 'mfm-spinY' : 'mfm-spin'
              const speed = validTime(token.props.args.speed) ?? '1.5s'
              const delay = validTime(token.props.args.delay) ?? '0s'
              style = useAnim
                ? {
                    animation: `${anime} ${speed} linear infinite`,
                    animationDirection: direction,
                    animationDelay: delay,
                  }
                : {}
              break
            }
            case 'jump': {
              const speed = validTime(token.props.args.speed) ?? '0.75s'
              const delay = validTime(token.props.args.delay) ?? '0s'
              style = useAnim
                ? {
                    animation: `mfm-jump ${speed} linear infinite`,
                    animationDelay: delay,
                  }
                : {}
              break
            }
            case 'bounce': {
              const speed = validTime(token.props.args.speed) ?? '0.75s'
              const delay = validTime(token.props.args.delay) ?? '0s'
              style = useAnim
                ? {
                    animation: `mfm-bounce ${speed} linear infinite`,
                    transformOrigin: 'center bottom',
                    animationDelay: delay,
                  }
                : {}
              break
            }
            case 'flip': {
              const transform
                = token.props.args.h && token.props.args.v
                  ? 'scale(-1, -1)'
                  : token.props.args.v
                    ? 'scaleY(-1)'
                    : 'scaleX(-1)'
              style = {
                transform: `${transform}`,
              }
              break
            }
            case 'x2': {
              if (props.inline) {
                return <span style={{ fontSize: '120%' }}>{genEl(token.children, scale * 1.2)}</span>
              }
              else {
                return (
                  <span className={defaultStore.state.advancedMfm ? 'mfm-x2' : ''}>
                    {genEl(token.children, scale * 2)}
                  </span>
                )
              }
            }
            case 'x3': {
              if (props.inline) {
                return <span style={{ fontSize: '120%' }}>{genEl(token.children, scale * 1.2)}</span>
              }
              else {
                return (
                  <span className={defaultStore.state.advancedMfm ? 'mfm-x3' : ''}>
                    {genEl(token.children, scale * 3)}
                  </span>
                )
              }
            }
            case 'x4': {
              if (props.inline) {
                return <span style={{ fontSize: '120%' }}>{genEl(token.children, scale * 1.2)}</span>
              }
              else {
                return (
                  <span className={defaultStore.state.advancedMfm ? 'mfm-x4' : ''}>
                    {genEl(token.children, scale * 4)}
                  </span>
                )
              }
            }
            case 'font': {
              const family = token.props.args.serif
                ? 'serif'
                : token.props.args.monospace
                  ? 'monospace'
                  : token.props.args.cursive
                    ? 'cursive'
                    : token.props.args.fantasy
                      ? 'fantasy'
                      : token.props.args.emoji
                        ? 'emoji'
                        : token.props.args.math
                          ? 'math'
                          : null
              if (family) {
                style ||= {}
                style.fontFamily = family
              }
              break
            }
            case 'blur': {
              return <span className="_mfm_blur_">{genEl(token.children, scale)}</span>
            }
            case 'rainbow': {
              if (!useAnim) {
                return <span className="_mfm_rainbow_fallback_">{genEl(token.children, scale)}</span>
              }
              const speed = validTime(token.props.args.speed) ?? '1s'
              const delay = validTime(token.props.args.delay) ?? '0s'
              style = {
                animation: `mfm-rainbow ${speed} linear infinite`,
                animationDelay: delay,
              }
              break
            }
            case 'sparkle': {
              if (!useAnim) {
                return genEl(token.children, scale)
              }
              return <span className="_mfm_sparkle_">{genEl(token.children, scale)}</span>
            }
            case 'fade': {
              if (!useAnim) {
                style = {}
                break
              }

              const direction = token.props.args.out ? 'alternate-reverse' : 'alternate'
              const speed = validTime(token.props.args.speed) ?? '1.5s'
              const delay = validTime(token.props.args.delay) ?? '0s'
              const loop = safeParseFloat(token.props.args.loop) ?? 'infinite'
              style = {
                animation: `mfm-fade ${speed} ${delay} linear ${loop}`,
                animationDirection: direction,
              }
              break
            }
            case 'rotate': {
              if (props.inline) {
                style = { fontStyle: 'italic' }
                break
              }
              const degrees = safeParseFloat(token.props.args.deg) ?? 90
              style = {
                transform: `rotate(${degrees}deg)`,
                transformOrigin: 'center center',
              }
              break
            }
            // // This is a sharkey extension and is currently disabled
            // case 'followmouse': {
            //   if (props.inline) {
            //     style = 'font-style: italic;'
            //     break
            //   }
            //   // Make sure advanced MFM is on and that reduced motion is off
            //   if (!useAnim) {
            //     style = ''
            //     break
            //   }

            //   let x = !!token.props.args.x
            //   let y = !!token.props.args.y

            //   if (!x && !y) {
            //     x = true
            //     y = true
            //   }

            //   return (
            //     <span
            //       data-x={x}
            //       data-y={y}
            //       data-speed={validTime(token.props.args.speed) ?? '0.1s'}
            //       data-rotate-by-velocity={!!token.props.args.rotateByVelocity}
            //     >
            //       {genEl(token.children, scale)}
            //     </span>
            //   )
            // }
            case 'position': {
              if (props.inline) {
                style = { fontStyle: 'italic' }
                break
              }
              if (!defaultStore.state.advancedMfm) break
              const x = safeParseFloat(token.props.args.x) ?? 0
              const y = safeParseFloat(token.props.args.y) ?? 0
              style = {
                transform: `translateX(${x}em) translateY(${y}em)`,
              }
              break
            }
            case 'crop': {
              const top = Number.parseFloat((token.props.args.top ?? '0').toString())
              const right = Number.parseFloat((token.props.args.right ?? '0').toString())
              const bottom = Number.parseFloat((token.props.args.bottom ?? '0').toString())
              const left = Number.parseFloat((token.props.args.left ?? '0').toString())
              style = {
                clipPath: `inset(${top}% ${right}% ${bottom}% ${left}%)`,
              }
              break
            }
            case 'scale': {
              if (props.inline) {
                style = { fontStyle: 'italic' }
                break
              }
              if (!defaultStore.state.advancedMfm) {
                style = {}
                break
              }
              const x = Math.min(safeParseFloat(token.props.args.x) ?? 1, 5)
              const y = Math.min(safeParseFloat(token.props.args.y) ?? 1, 5)
              style = { transform: `scale(${x}, ${y})` }
              scale = scale * Math.max(x, y)
              break
            }
            case 'fg': {
              let color = validColor(token.props.args.color)
              color = color ?? 'f00'
              style = { color: `#${color}`, overflowWrap: 'anywhere' }
              break
            }
            case 'bg': {
              let color = validColor(token.props.args.color)
              color = color ?? 'f00'
              style = {
                backgroundColor: `#${color}`,
                overflowWrap: 'anywhere',
              }
              break
            }
            case 'border': {
              let color = validColor(token.props.args.color)
              color = color ? `#${color}` : 'var(--MI_THEME-accent)'
              let b_style = token.props.args.style
              if (
                typeof b_style !== 'string'
                || !['hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'].includes(
                  b_style,
                )
              )
                b_style = 'solid'
              const width = safeParseFloat(token.props.args.width) ?? 1
              const radius = safeParseFloat(token.props.args.radius) ?? 0
              style = {
                border: `${width}px ${b_style} ${color}`,
                borderRadius: `${radius}px`,
                overflow: token.props.args.noclip ? 'visible' : 'clip',
              }
              break
            }
            case 'ruby': {
              if (token.children.length === 1) {
                const child = token.children[0]
                let text = child.type === 'text' ? child.props.text : ''
                if (!disableNyaize && shouldNyaize) {
                  text = Misskey.nyaize(text)
                }
                return (
                  <ruby>
                    {text.split('|')[0]}
                    <rt>{text.split('|')[1]}</rt>
                  </ruby>
                )
              }
              else {
                const rt = token.children.at(-1)!
                let text = rt.type === 'text' ? rt.props.text : ''
                if (!disableNyaize && shouldNyaize) {
                  text = Misskey.nyaize(text)
                }
                return (
                  <ruby>
                    {genEl(token.children.slice(0, token.children.length - 1), scale)}
                    <rt>{text.trim()}</rt>
                  </ruby>
                )
              }
            }
            case 'group': {
              // this is mostly a hack for the insides of `ruby`
              style = {}
              break
            }
            case 'unixtime': {
              const child = token.children[0]
              const unixtime = parseInt(child.type === 'text' ? child.props.text : '')
              return (
                <span>
                  <ClockIcon />
                  <time dateTime={(unixtime * 1000).toString()} />
                </span>
              )
            }

            case 'clickable': {
              if (props.inline) {
                style = { fontStyle: 'italic' }
                break
              }
              <span
                onClick={(ev) => {
                  ev.stopPropagation()
                  ev.preventDefault()
                  const clickEv = typeof token.props.args.ev === 'string' ? token.props.args.ev : ''
                  props.clickEv?.(clickEv)
                }}
              >
                {genEl(token.children, scale)}
              </span>
            }
          }
          if (style === undefined) {
            return (
              <span>
                $[
                {token.props.name}
                {' '}
                {genEl(token.children, scale)}
                ]
              </span>
            )
          }
          else {
            return <span style={{ display: 'inline-block', ...style }}>{genEl(token.children, scale)}</span>
          }
        }

        case 'small': {
          if (props.inline) {
            return <span style={{ opacity: 0.7 }}>{genEl(token.children, scale)}</span>
          }
          return [<small style={{ opacity: 0.7 }}>{genEl(token.children, scale)}</small>]
        }

        case 'center': {
          if (props.inline) {
            return <span>{genEl(token.children, scale)}</span>
          }
          return (
            <div className="mfm-center text-center">
              <bdi>{genEl(token.children, scale)}</bdi>
            </div>
          )
        }

        case 'url': {
          if (props.inline) {
            return <span className="text-blue-500">{token.props.url}</span>
          }
          return (
            <bdi>
              <MkUrl
                key={Math.random()}
                url={token.props.url}
                rel="nofollow noopener"
                navigationBehavior={props.linkNavigationBehavior}
              />
            </bdi>
          )
        }

        case 'link': {
          if (props.inline) {
            return <span className="text-blue-500">{genEl(token.children, scale)}</span>
          }
          return (
            <bdi>
              <MkUrl
                key={Math.random()}
                url={token.props.url}
                rel="nofollow noopener"
                navigationBehavior={props.linkNavigationBehavior}
              >
                {genEl(token.children, scale, true)}
              </MkUrl>
            </bdi>
          )
        }

        case 'mention': {
          const mentionHost
            = token.props.host == null && props.author && props.author.host != null
              ? props.author.host
              : token.props.host

          return (
            <bdi>
              <MkMention
                key={Math.random()}
                username={token.props.username}
                host={mentionHost}
                noNavigate={props.inline}
              />
            </bdi>
          )
        }

        case 'hashtag': {
          // TODO
          return (
            <bdi>
              <MkHashTag name={token.props.hashtag} />
            </bdi>
          )
        }

        case 'blockCode': {
          if (props.inline) {
            return <code>{token.props.code.replaceAll('\n', '  ')}</code>
          }
          return (
            <bdi className="block">
              <pre>
                <code>{token.props.code}</code>
              </pre>
            </bdi>
          )
        }

        case 'inlineCode': {
          return (
            <bdi>
              <code>{token.props.code}</code>
            </bdi>
          )
        }

        case 'quote': {
          if (!props.nowrap) {
            return (
              <bdi className="block">
                <blockquote>
                  <bdi>{genEl(token.children, scale, true)}</bdi>
                </blockquote>
              </bdi>
            )
          }
          else {
            return (
              <bdi>
                <i>
                  &gt;
                  {genEl(token.children, scale, true)}
                </i>
              </bdi>
            )
          }
        }

        case 'emojiCode': {
          if (props.author?.host == null) {
            return (
              <MkCustomEmoji
                key={Math.random()}
                name={token.props.name}
                normal={props.plain || props.inline}
                host={null}
                useOriginalSize={scale >= 2.5}
                menu={props.enableEmojiMenu}
                menuReaction={props.enableEmojiMenuReaction}
                fallbackToImage={false}
              />
            )
          }
          else {
            if (props.emojiUrls && props.emojiUrls[token.props.name] == null) {
              return <span>{`:${token.props.name}:`}</span>
            }
            else {
              return (
                <MkCustomEmoji
                  key={Math.random()}
                  name={token.props.name}
                  url={props.emojiUrls?.[token.props.name]}
                  normal={props.plain || props.inline}
                  host={props.author.host}
                  useOriginalSize={scale >= 2.5}
                />
              )
            }
          }
        }

        case 'unicodeEmoji': {
          return (
            <MkEmoji
              key={Math.random()}
              emoji={token.props.emoji}
              menu={props.enableEmojiMenu}
              menuReaction={props.enableEmojiMenuReaction}
            />
          )
        }

        case 'mathInline': {
          if (props.inline) {
            return <i>{token.props.formula}</i>
          }
          return (
            <bdi>
              <code>{token.props.formula}</code>
            </bdi>
          )
        }

        case 'mathBlock': {
          if (props.inline) {
            return <i>{token.props.formula}</i>
          }
          return (
            <bdi className="block">
              <pre>{token.props.formula}</pre>
            </bdi>
          )
        }

        case 'search': {
          if (props.inline) {
            return (
              <i>
                [Search]
                {token.props.query}
              </i>
            )
          }
          return (
            <span key={Math.random()} data-query={token.props.query}>
              {token.props.query}
            </span>
          )
        }

        case 'plain': {
          return (
            <bdi>
              <span>{genEl(token.children, scale, true)}</span>
            </bdi>
          )
        }

        default: {
          // @ts-expect-error 存在しないASTタイプ
          console.error('unrecognized ast type:', token.type)

          return []
        }
      }
    })

  return (
    <bdi className={classList.join(' ')}>
      <span className={props.nowrap ? 'inline-block truncate line-clamp-1 whitespace-pre' : 'whitespace-pre-wrap'}>
        {genEl(rootAst, props.rootScale ?? 1)}
      </span>
    </bdi>
  )
}
