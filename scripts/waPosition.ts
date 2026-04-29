export default function WaPosition() {
  return {
    name: 'wa-position',
    apply: 'serve',
    enforce: 'pre',
    transform(code: string, id: string) {
      const index = id.lastIndexOf('.');
      const ext = id.slice(index + 1);
      if (['jsx', 'tsx'].includes(ext.toLowerCase())) {
        return codeLineTrack(code, id);
      }
    },
  };
}

const codeLineTrack = (code: string, id: string) => {
  const lineList = code.split('\n');
  const newList: string[] = [];
  lineList.forEach((item, index) => {
    newList.push(addLineAttr(item, index + 1, id)); // 添加位置属性，index+1为具体的代码行号
  });
  return newList.join('\n');
};

const addLineAttr = (lineStr: string, line: number, id: string) => {
  const ignoreRegList = [/<[^<>\s\\]+(<)/, /[^<>\s\\]+(<)/, /=[\s]*</];
  const regList = [/(<[A-Za-z._\d]+)[^<]*(?=>|$)/];
  for (const reg of ignoreRegList) {
    if (lineStr.match(reg)) {
      return lineStr;
    }
  }

  for (const reg of regList) {
    const match = lineStr.match(reg);
    if (match) {
      const item = match[1];
      const skip = ['React.Fragment', 'Fragment'];
      if (skip.some((i) => item.indexOf(i) > -1)) {
        return lineStr;
      }

      const reg = new RegExp(`${item}`);
      const location = `${item} data-code-location="${id}:${line}" `;
      lineStr = lineStr.replace(reg, location);
    }
  }
  return lineStr;
};
