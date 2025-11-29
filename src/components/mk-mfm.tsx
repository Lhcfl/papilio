/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ClockIcon } from 'lucide-react';
import * as mfm from 'mfm-js';
import { nyaize as doNyaize } from 'misskey-js';
import { useMemo, type CSSProperties } from 'react';
import { MkCustomEmoji, MkEmoji } from '@/components/mk-emoji';
import { MkHashTag } from '@/components/mk-hashtag';
import { MkMention } from '@/components/mk-mention';
import { MkUrl } from '@/components/mk-url';
import type { UserLite } from '@/types/user';
import { MkCode } from '@/components/mk-code';
import { cn } from '@/lib/utils';

function safeParseFloat(str: unknown): number | null {
  if (typeof str !== 'string' || str === '') return null;
  const num = parseFloat(str);
  if (Number.isNaN(num)) return null;
  return num;
}

interface MfmProps {
  text: string;
  /** only process emojis */
  plain?: boolean;
  /** parse as inline elements */
  inline?: boolean;
  nowrap?: boolean;
  author?: UserLite;
  noteContext?: { noteId: string; myReaction?: string | null };
  emojiUrls?: Record<string, string | undefined>;
  rootScale?: number;
  nyaize?: boolean | 'respect';
  parsedNodes?: mfm.MfmNode[] | null;
  enableEmojiMenu?: boolean;
  enableEmojiMenuReaction?: boolean;
  isAnim?: boolean;
  isBlock?: boolean;
  linkNavigationBehavior?: unknown;
  clickEv?: (clickEv: string) => void;
}

const defaultStore = {
  state: {
    advancedMfm: true,
  },
};

const validTime = (t: string | boolean | null | undefined) => {
  if (t == null) return null;
  if (typeof t === 'boolean') return null;
  return /^-?[0-9.]+s$/.exec(t) ? t : null;
};

const validColor = (c: unknown): string | null => {
  if (typeof c !== 'string') return null;
  return /^[0-9a-f]{3,6}$/i.exec(c) ? c : null;
};

export const MkMfm = (in_props: MfmProps) => {
  const {
    text,
    plain: plainMode = false,
    inline: inlineMode = false,
    nowrap = false,
    author,
    noteContext,
    emojiUrls = {},
    rootScale,
    nyaize = 'respect',
    parsedNodes,
    enableEmojiMenu = false,
    enableEmojiMenuReaction = false,
    isAnim = true,
    isBlock = false,
    linkNavigationBehavior,
    clickEv,
  } = in_props;

  // const host = null;

  // TODO: make this configurable
  const shouldNyaize = nyaize === 'respect' ? author?.isCat : nyaize;
  // TODO: make this configurable
  const useAnim = isAnim;

  const rootAst = useMemo(
    () => parsedNodes ?? (plainMode ? mfm.parseSimple : mfm.parse)(text),
    [parsedNodes, text, plainMode],
  );

  if (!text) return null;

  const genEl = (ast: mfm.MfmNode[], scale: number, disableNyaize = false) =>
    ast.map((token): React.ReactNode => {
      switch (token.type) {
        case 'text': {
          let text = token.props.text.replace(/(\r\n|\n|\r)/g, '\n');

          if (!disableNyaize && shouldNyaize) {
            text = doNyaize(text);
          }

          if (!plainMode && !inlineMode) {
            return text
              .split('\n')
              .map((t, i) => [i > 0 && <br key={Math.random()} />, <span key={Math.random()}>{t}</span>]);
          } else {
            return <span key={Math.random()}>{text.replace(/\n/g, ' ')}</span>;
          }
        }
        case 'bold':
          return <b key={Math.random()}>{genEl(token.children, scale)}</b>;
        case 'strike':
          return <del key={Math.random()}>{genEl(token.children, scale)}</del>;
        case 'italic':
          return (
            <i key={Math.random()} style={{ fontStyle: 'oblique' }}>
              {genEl(token.children, scale)}
            </i>
          );

        case 'fn': {
          // TODO: CSSを文字列で組み立てていくと token.props.args.~~~ 経由でCSSインジェクションできるのでよしなにやる
          let style: CSSProperties | undefined;
          switch (token.props.name) {
            case 'tada': {
              const speed = validTime(token.props.args.speed) ?? '1s';
              const delay = validTime(token.props.args.delay) ?? '0s';
              style = {
                fontSize: '150%',
                ...(useAnim
                  ? {
                      animation: `global-tada ${speed} linear infinite both`,
                      animationDelay: delay,
                    }
                  : {}),
              };
              break;
            }
            case 'jelly': {
              const speed = validTime(token.props.args.speed) ?? '1s';
              const delay = validTime(token.props.args.delay) ?? '0s';
              style = {
                animation: `mfm-rubberBand ${speed} linear infinite both`,
                animationDelay: delay,
              };
              break;
            }
            case 'twitch': {
              const speed = validTime(token.props.args.speed) ?? '0.5s';
              const delay = validTime(token.props.args.delay) ?? '0s';
              style = useAnim
                ? {
                    animation: `mfm-twitch ${speed} ease infinite`,
                    animationDelay: delay,
                  }
                : {};
              break;
            }
            case 'shake': {
              const speed = validTime(token.props.args.speed) ?? '0.5s';
              const delay = validTime(token.props.args.delay) ?? '0s';
              style = useAnim
                ? {
                    animation: `mfm-shake ${speed} ease infinite`,
                    animationDelay: delay,
                  }
                : {};
              break;
            }
            case 'spin': {
              const direction = token.props.args.left ? 'reverse' : token.props.args.alternate ? 'alternate' : 'normal';
              const anime = token.props.args.x ? 'mfm-spinX' : token.props.args.y ? 'mfm-spinY' : 'mfm-spin';
              const speed = validTime(token.props.args.speed) ?? '1.5s';
              const delay = validTime(token.props.args.delay) ?? '0s';
              style = useAnim
                ? {
                    animation: `${anime} ${speed} linear infinite`,
                    animationDirection: direction,
                    animationDelay: delay,
                  }
                : {};
              break;
            }
            case 'jump': {
              const speed = validTime(token.props.args.speed) ?? '0.75s';
              const delay = validTime(token.props.args.delay) ?? '0s';
              style = useAnim
                ? {
                    animation: `mfm-jump ${speed} linear infinite`,
                    animationDelay: delay,
                  }
                : {};
              break;
            }
            case 'bounce': {
              const speed = validTime(token.props.args.speed) ?? '0.75s';
              const delay = validTime(token.props.args.delay) ?? '0s';
              style = useAnim
                ? {
                    animation: `mfm-bounce ${speed} linear infinite`,
                    transformOrigin: 'center bottom',
                    animationDelay: delay,
                  }
                : {};
              break;
            }
            case 'flip': {
              const transform =
                token.props.args.h && token.props.args.v
                  ? 'scale(-1, -1)'
                  : token.props.args.v
                    ? 'scaleY(-1)'
                    : 'scaleX(-1)';
              style = {
                transform: transform,
              };
              break;
            }
            case 'x2': {
              if (inlineMode) {
                return (
                  <span key={Math.random()} style={{ fontSize: '120%' }}>
                    {genEl(token.children, scale * 1.2)}
                  </span>
                );
              } else {
                return (
                  <span key={Math.random()} className={defaultStore.state.advancedMfm ? 'mfm-x2' : ''}>
                    {genEl(token.children, scale * 2)}
                  </span>
                );
              }
            }
            case 'x3': {
              if (inlineMode) {
                return (
                  <span key={Math.random()} style={{ fontSize: '120%' }}>
                    {genEl(token.children, scale * 1.2)}
                  </span>
                );
              } else {
                return (
                  <span key={Math.random()} className={defaultStore.state.advancedMfm ? 'mfm-x3' : ''}>
                    {genEl(token.children, scale * 3)}
                  </span>
                );
              }
            }
            case 'x4': {
              if (inlineMode) {
                return (
                  <span key={Math.random()} style={{ fontSize: '120%' }}>
                    {genEl(token.children, scale * 1.2)}
                  </span>
                );
              } else {
                return (
                  <span key={Math.random()} className={defaultStore.state.advancedMfm ? 'mfm-x4' : ''}>
                    {genEl(token.children, scale * 4)}
                  </span>
                );
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
                          : null;
              if (family) {
                style = style ?? {};
                style.fontFamily = family;
              }
              break;
            }
            case 'blur': {
              return (
                <span key={Math.random()} className="_mfm_blur_">
                  {genEl(token.children, scale)}
                </span>
              );
            }
            case 'rainbow': {
              if (!useAnim) {
                return (
                  <span key={Math.random()} className="_mfm_rainbow_fallback_">
                    {genEl(token.children, scale)}
                  </span>
                );
              }
              const speed = validTime(token.props.args.speed) ?? '1s';
              const delay = validTime(token.props.args.delay) ?? '0s';
              style = {
                animation: `mfm-rainbow ${speed} linear infinite`,
                animationDelay: delay,
              };
              break;
            }
            case 'sparkle': {
              if (!useAnim) {
                return genEl(token.children, scale);
              }
              return (
                <span key={Math.random()} className="_mfm_sparkle_">
                  {genEl(token.children, scale)}
                </span>
              );
            }
            case 'fade': {
              if (!useAnim) {
                style = {};
                break;
              }

              const direction = token.props.args.out ? 'alternate-reverse' : 'alternate';
              const speed = validTime(token.props.args.speed) ?? '1.5s';
              const delay = validTime(token.props.args.delay) ?? '0s';
              const loop = safeParseFloat(token.props.args.loop) ?? 'infinite';
              style = {
                animation: `mfm-fade ${speed} ${delay} linear ${loop}`,
                animationDirection: direction,
              };
              break;
            }
            case 'rotate': {
              if (inlineMode) {
                style = { fontStyle: 'italic' };
                break;
              }
              const degrees = safeParseFloat(token.props.args.deg) ?? 90;
              style = {
                transform: `rotate(${degrees}deg)`,
                transformOrigin: 'center center',
              };
              break;
            }
            // // This is a sharkey extension and is currently disabled
            // case 'followmouse': {
            //   if (inlineMode) {
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
              if (inlineMode) {
                style = { fontStyle: 'italic' };
                break;
              }
              if (!defaultStore.state.advancedMfm) break;
              const x = safeParseFloat(token.props.args.x) ?? 0;
              const y = safeParseFloat(token.props.args.y) ?? 0;
              style = {
                transform: `translateX(${x}em) translateY(${y}em)`,
              };
              break;
            }
            case 'crop': {
              const top = Number.parseFloat((token.props.args.top || '0').toString());
              const right = Number.parseFloat((token.props.args.right || '0').toString());
              const bottom = Number.parseFloat((token.props.args.bottom || '0').toString());
              const left = Number.parseFloat((token.props.args.left || '0').toString());
              style = {
                clipPath: `inset(${top}% ${right}% ${bottom}% ${left}%)`,
              };
              break;
            }
            case 'scale': {
              if (inlineMode) {
                style = { fontStyle: 'italic' };
                break;
              }
              if (!defaultStore.state.advancedMfm) {
                style = {};
                break;
              }
              const x = Math.min(safeParseFloat(token.props.args.x) ?? 1, 5);
              const y = Math.min(safeParseFloat(token.props.args.y) ?? 1, 5);
              style = { transform: `scale(${x}, ${y})` };
              scale = scale * Math.max(x, y);
              break;
            }
            case 'fg': {
              let color = validColor(token.props.args.color);
              color = color ?? 'f00';
              style = { color: `#${color}`, overflowWrap: 'anywhere' };
              break;
            }
            case 'bg': {
              let color = validColor(token.props.args.color);
              color = color ?? 'f00';
              style = {
                backgroundColor: `#${color}`,
                overflowWrap: 'anywhere',
              };
              break;
            }
            case 'border': {
              let color = validColor(token.props.args.color);
              color = color ? `#${color}` : 'var(--MI_THEME-accent)';
              let b_style = token.props.args.style;
              if (
                typeof b_style !== 'string' ||
                !['hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'].includes(
                  b_style,
                )
              )
                b_style = 'solid';
              const width = safeParseFloat(token.props.args.width) ?? 1;
              const radius = safeParseFloat(token.props.args.radius) ?? 0;
              style = {
                border: `${width}px ${b_style} ${color}`,
                borderRadius: `${radius}px`,
                overflow: token.props.args.noclip ? 'visible' : 'clip',
              };
              break;
            }
            case 'ruby': {
              if (token.children.length === 1) {
                const child = token.children[0];
                let text = child.type === 'text' ? child.props.text : '';
                if (!disableNyaize && shouldNyaize) {
                  text = doNyaize(text);
                }
                return (
                  <ruby key={Math.random()}>
                    {text.split('|')[0]}
                    <rt>{text.split('|')[1]}</rt>
                  </ruby>
                );
              } else {
                const rt = token.children.at(-1)!;
                let text = rt.type === 'text' ? rt.props.text : '';
                if (!disableNyaize && shouldNyaize) {
                  text = doNyaize(text);
                }
                return (
                  <ruby key={Math.random()}>
                    {genEl(token.children.slice(0, token.children.length - 1), scale)}
                    <rt>{text.trim()}</rt>
                  </ruby>
                );
              }
            }
            case 'group': {
              // this is mostly a hack for the insides of `ruby`
              style = {};
              break;
            }
            case 'unixtime': {
              const child = token.children[0];
              const unixtime = parseInt(child.type === 'text' ? child.props.text : '');
              return (
                <span key={Math.random()}>
                  <ClockIcon />
                  <time dateTime={(unixtime * 1000).toString()} />
                </span>
              );
            }

            case 'clickable': {
              if (inlineMode) {
                style = { fontStyle: 'italic' };
                break;
              }
              <span
                key={Math.random()}
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  const evName = typeof token.props.args.ev === 'string' ? token.props.args.ev : '';
                  clickEv?.(evName);
                }}
              >
                {genEl(token.children, scale)}
              </span>;
            }
          }
          if (style === undefined) {
            return (
              <span key={Math.random()}>
                $[
                {token.props.name} {genEl(token.children, scale)}]
              </span>
            );
          } else {
            return (
              <span key={Math.random()} style={{ display: 'inline-block', ...style }}>
                {genEl(token.children, scale)}
              </span>
            );
          }
        }

        case 'small': {
          if (inlineMode) {
            return (
              <span key={Math.random()} style={{ opacity: 0.7 }}>
                {genEl(token.children, scale)}
              </span>
            );
          }
          return (
            <small key={Math.random()} style={{ opacity: 0.7 }}>
              {genEl(token.children, scale)}
            </small>
          );
        }

        case 'center': {
          if (inlineMode) {
            return <span key={Math.random()}>{genEl(token.children, scale)}</span>;
          }
          return (
            <div key={Math.random()} className="mfm-center text-center">
              <bdi>{genEl(token.children, scale)}</bdi>
            </div>
          );
        }

        case 'url': {
          return (
            <bdi key={Math.random()}>
              <MkUrl
                key={Math.random()}
                url={token.props.url}
                rel="nofollow noopener"
                navigationBehavior={linkNavigationBehavior}
                noNavigate={inlineMode}
              />
            </bdi>
          );
        }

        case 'link': {
          return (
            <bdi key={Math.random()}>
              <MkUrl
                key={Math.random()}
                url={token.props.url}
                rel="nofollow noopener"
                navigationBehavior={linkNavigationBehavior}
                noNavigate={inlineMode}
              >
                {genEl(token.children, scale, true)}
              </MkUrl>
            </bdi>
          );
        }

        case 'mention': {
          const mentionHost = token.props.host == null && author?.host != null ? author.host : token.props.host;

          return (
            <bdi key={Math.random()}>
              <MkMention
                key={Math.random()}
                username={token.props.username}
                host={mentionHost}
                noNavigate={inlineMode}
              />
            </bdi>
          );
        }

        case 'hashtag': {
          return (
            <bdi key={Math.random()}>
              <MkHashTag name={token.props.hashtag} noNavigate={inlineMode} />
            </bdi>
          );
        }

        case 'blockCode': {
          if (inlineMode) {
            return <code key={Math.random()}>{token.props.code.replaceAll('\n', '  ')}</code>;
          }
          return (
            <bdi key={Math.random()} className="block px-1 py-2">
              <MkCode code={token.props.code} language={token.props.lang} />
            </bdi>
          );
        }

        case 'inlineCode': {
          return (
            <bdi key={Math.random()}>
              <code>{token.props.code}</code>
            </bdi>
          );
        }

        case 'quote': {
          if (!nowrap) {
            return (
              <bdi key={Math.random()} className="block">
                <blockquote className="my-1 border-l-4 pl-3 opacity-80">
                  <bdi>{genEl(token.children, scale, true)}</bdi>
                </blockquote>
              </bdi>
            );
          } else {
            return (
              <bdi key={Math.random()}>
                <i>
                  &gt;
                  {genEl(token.children, scale, true)}
                </i>
              </bdi>
            );
          }
        }

        case 'emojiCode': {
          if (author?.host == null) {
            return (
              <MkCustomEmoji
                key={Math.random()}
                name={token.props.name}
                normal={plainMode || inlineMode}
                host={null}
                useOriginalSize={scale >= 2.5}
                menu={enableEmojiMenu}
                menuReaction={enableEmojiMenuReaction}
                fallbackToImage={false}
                noteContext={noteContext}
              />
            );
          } else {
            if (emojiUrls[token.props.name] == null) {
              return <span key={Math.random()}>{`:${token.props.name}:`}</span>;
            } else {
              return (
                <MkCustomEmoji
                  key={Math.random()}
                  name={token.props.name}
                  url={emojiUrls[token.props.name]}
                  normal={plainMode || inlineMode}
                  host={author.host}
                  useOriginalSize={scale >= 2.5}
                  noteContext={noteContext}
                  menu={enableEmojiMenu}
                  menuReaction={enableEmojiMenuReaction}
                />
              );
            }
          }
        }

        case 'unicodeEmoji': {
          return (
            <MkEmoji
              key={Math.random()}
              emoji={token.props.emoji}
              menu={enableEmojiMenu}
              menuReaction={enableEmojiMenuReaction}
              noteContext={noteContext}
            />
          );
        }

        case 'mathInline': {
          if (inlineMode) {
            return <i key={Math.random()}>{token.props.formula}</i>;
          }
          return (
            <bdi key={Math.random()}>
              <code>{token.props.formula}</code>
            </bdi>
          );
        }

        case 'mathBlock': {
          if (inlineMode) {
            return <i key={Math.random()}>{token.props.formula}</i>;
          }
          return (
            <bdi key={Math.random()} className="block">
              <pre>{token.props.formula}</pre>
            </bdi>
          );
        }

        case 'search': {
          if (inlineMode) {
            return (
              <i key={Math.random()}>
                [Search]
                {token.props.query}
              </i>
            );
          }
          return (
            <span key={Math.random()} data-query={token.props.query}>
              {token.props.query}
            </span>
          );
        }

        case 'plain': {
          return (
            <bdi key={Math.random()}>
              <span>{genEl(token.children, scale, true)}</span>
            </bdi>
          );
        }

        default: {
          // @ts-expect-error 存在しないASTタイプ
          console.error('unrecognized ast type:', token.type);

          return [];
        }
      }
    });

  return (
    <bdi
      className={cn('mfm wrap-break-word', {
        block: isBlock,
        'mfm-inline': inlineMode,
      })}
    >
      <span className={nowrap ? 'line-clamp-1 inline-block truncate whitespace-pre' : 'whitespace-pre-wrap'}>
        {genEl(rootAst, rootScale ?? 1)}
      </span>
    </bdi>
  );
};
