/**
 * 要检测一段字符是否为base64编码，可以使用以下方法：

 * 1. 检查字符长度是否为4的倍数，如果不是则不是base64编码。
 * 2. 检查字符是否只包含base64字符集中的字符，即A-Z、a-z、0-9、+、/和=（用于填充）。
 * 3. 检查填充字符“=”的位置是否正确。在base64编码中，每个字符都代表6个位，但不足24位的数据需要填充。如果有1个字节的数据，填充字符“=”出现在编码的结尾；如果有2个字节的数据，填充字符“=”出现在编码的结尾；如果有3个字节的数据，没有填充字符。

 * 如果以上三个条件都满足，则可以认为这段字符是base64编码。
 */

import { $commentCells, $topicContentBox } from './globals'

// 已知以下高频字符串不能作为 base64 字符串识别，排除掉。
const excludeList = [
  'boss',
  'bilibili',
  'Bilibili',
  'Encrypto',
  'encrypto',
  'Window10',
  'airpords',
  'Windows7',
]

const convertHTMLText = (text: string, excludeTextList?: string[]): string => {
  // 检查长度是否为4的倍数。
  if (text.length % 4 !== 0) {
    return text
  }

  // 从排除列表中排除掉非 base64 字符串。
  if (excludeList.includes(text)) {
    return text
  }

  // 检查填充字符 "=" 的位置是否正确。
  if (text.includes('=')) {
    const paddingIndex = text.indexOf('=')
    if (paddingIndex !== text.length - 1 && paddingIndex !== text.length - 2) {
      return text
    }
  }

  // 排除特定标签中的 base64 字符串。
  if (excludeTextList?.some((excludeText) => excludeText.includes(text))) {
    return text
  }

  try {
    const decodedStr = window.atob(text)
    return `${text}(<span class="v2p-decode" title="复制：${decodedStr}">${decodedStr}</span>)`
  } catch {
    return text
  }
}

const base64regex = /[A-z0-9+/=]+/g

const contentHandler = (_: number, content: HTMLElement) => {
  const excludeTextList = [
    ...content.getElementsByTagName('a'),
    ...content.getElementsByTagName('img'),
  ].map((ele) => ele.outerHTML)

  content.innerHTML = content.innerHTML.replace(base64regex, (htmlText) =>
    convertHTMLText(htmlText, excludeTextList)
  )
}

$commentCells.find('.reply_content').each(contentHandler)

$topicContentBox.find('.topic_content').each(contentHandler)

$('.v2p-decode').on('click', (ev) => {
  const text = ev.target.innerText
  void navigator.clipboard.writeText(text)
})