import { useEffect, useRef, useState } from 'react';

// Hệ thống file giả. Không có gì ở đây chạy trên máy thật.
type FNode = { type: 'dir'; perm: string; owner: string; children: Record<string, FNode> } | { type: 'file'; perm: string; owner: string; content: string };

const dir = (owner: string, perm: string, children: Record<string, FNode>): FNode => ({ type: 'dir', perm, owner, children });
const file = (owner: string, perm: string, content: string): FNode => ({ type: 'file', perm, owner, content });

const ROOT: FNode = dir('root', 'rwxr-xr-x', {
  etc: dir('root', 'rwxr-xr-x', {
    hostname: file('root', 'rw-r--r--', 'lab-ubuntu'),
    passwd: file('root', 'rw-r--r--', 'root:x:0:0:root:/root:/bin/bash\nhocvien:x:1000:1000:Hoc Vien:/home/hocvien:/bin/bash'),
    shadow: file('root', 'rw-r-----', '(nội dung bị ẩn)'),
  }),
  home: dir('root', 'rwxr-xr-x', {
    hocvien: dir('hocvien', 'rwxr-x---', {
      'ghi-chu.txt': file('hocvien', 'rw-r--r--', 'Chào mừng tới lab Linux.\nGợi ý: thử vào thư mục /etc và đọc file hostname.'),
      'bai-tap': dir('hocvien', 'rwxr-xr-x', {
        'chao.sh': file('hocvien', 'rwxr-xr-x', '#!/bin/bash\necho "Xin chao"'),
      }),
    }),
  }),
  root: dir('root', 'rwx------', {}),
  tmp: dir('root', 'rwxrwxrwt', {}),
});

const USER = 'hocvien';
const HOME = '/home/hocvien';

function resolve(cwd: string, p: string): string {
  const raw = p.startsWith('/') ? p : p === '~' || p.startsWith('~/') ? HOME + p.slice(1) : `${cwd}/${p}`;
  const out: string[] = [];
  for (const seg of raw.split('/')) {
    if (!seg || seg === '.') continue;
    if (seg === '..') out.pop();
    else out.push(seg);
  }
  return '/' + out.join('/');
}

function lookup(path: string): FNode | null {
  let node: FNode = ROOT;
  for (const seg of path.split('/').filter(Boolean)) {
    if (node.type !== 'dir') return null;
    const next: FNode | undefined = node.children[seg];
    if (!next) return null;
    node = next;
  }
  return node;
}

// Kiểm tra quyền đơn giản: chủ sở hữu dùng 3 ký tự đầu, người khác dùng 3 ký tự cuối.
function can(node: FNode, what: 'r' | 'x'): boolean {
  const set = node.owner === USER ? node.perm.slice(0, 3) : node.perm.slice(6, 9);
  return set.includes(what);
}

const TASKS = [
  { text: 'Xem bạn đang đứng ở thư mục nào', test: (c: string) => c === 'pwd' },
  { text: 'Liệt kê file trong thư mục hiện tại', test: (c: string) => c.startsWith('ls') },
  { text: 'Đọc nội dung file ghi-chu.txt', test: (c: string) => c.startsWith('cat') && c.includes('ghi-chu') },
  { text: 'Chuyển sang thư mục /etc', test: (c: string, cwd: string) => c.startsWith('cd') && cwd === '/etc' },
  { text: 'Xem quyền của các file trong /etc bằng ls -l', test: (c: string, cwd: string) => c.startsWith('ls -l') && (cwd === '/etc' || c.includes('/etc')) },
  { text: 'Thử đọc /etc/shadow và xem chuyện gì xảy ra', test: (c: string) => c.startsWith('cat') && c.includes('shadow') },
];

const HELP = `Các lệnh có trong lab này:
  pwd            in ra thư mục hiện tại
  ls [-l] [đích] liệt kê file (-l: xem chi tiết và quyền)
  cd <đích>      chuyển thư mục (cd .. để lùi ra)
  cat <file>     in nội dung file
  whoami         bạn đang là người dùng nào
  id             xem user và nhóm
  clear          xoá màn hình`;

export default function FakeTerminal() {
  const [cwd, setCwd] = useState(HOME);
  const [lines, setLines] = useState<string[]>(['Gõ help để xem các lệnh. Đây là terminal giả lập, chạy trong trình duyệt.']);
  const [input, setInput] = useState('');
  const [doneTasks, setDoneTasks] = useState<boolean[]>(TASKS.map(() => false));
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
  }, [lines]);

  const prompt = (d: string) => `${USER}@lab:${d.startsWith(HOME) ? '~' + d.slice(HOME.length) : d}$`;

  function run(cmdRaw: string) {
    const cmd = cmdRaw.trim().replace(/\s+/g, ' ');
    const [name, ...args] = cmd.split(' ');
    let out = '';
    let nextCwd = cwd;
    if (!cmd) out = '';
    else if (name === 'help') out = HELP;
    else if (name === 'pwd') out = cwd;
    else if (name === 'whoami') out = USER;
    else if (name === 'id') out = 'uid=1000(hocvien) gid=1000(hocvien) groups=1000(hocvien)';
    else if (name === 'clear') {
      setLines([]);
      finish(cmd, cwd);
      return;
    } else if (name === 'cd') {
      const target = resolve(cwd, args[0] ?? '~');
      const n = lookup(target);
      if (!n) out = `cd: ${args[0]}: Không có file hoặc thư mục này`;
      else if (n.type !== 'dir') out = `cd: ${args[0]}: Không phải thư mục`;
      else if (!can(n, 'x')) out = `cd: ${args[0]}: Permission denied`;
      else nextCwd = target;
    } else if (name === 'ls') {
      const long = args.includes('-l') || args.includes('-la') || args.includes('-al');
      const tArg = args.find((a) => !a.startsWith('-'));
      const target = resolve(cwd, tArg ?? '.');
      const n = lookup(target);
      if (!n) out = `ls: không truy cập được '${tArg}': Không có file hoặc thư mục này`;
      else if (n.type === 'file') out = long ? `-${n.perm} ${n.owner} ${n.owner} ${target.split('/').pop()}` : target.split('/').pop()!;
      else if (!can(n, 'r')) out = `ls: không mở được thư mục '${tArg ?? '.'}': Permission denied`;
      else {
        const entries = Object.entries(n.children);
        out = long
          ? entries.map(([k, c]) => `${c.type === 'dir' ? 'd' : '-'}${c.perm} ${c.owner.padEnd(7)} ${c.owner.padEnd(7)} ${k}`).join('\n') || '(trống)'
          : entries.map(([k, c]) => (c.type === 'dir' ? k + '/' : k)).join('  ') || '(trống)';
      }
    } else if (name === 'cat') {
      if (!args[0]) out = 'cat: cần tên file';
      else {
        const target = resolve(cwd, args[0]);
        const n = lookup(target);
        if (!n) out = `cat: ${args[0]}: Không có file hoặc thư mục này`;
        else if (n.type === 'dir') out = `cat: ${args[0]}: Là một thư mục`;
        else if (!can(n, 'r')) out = `cat: ${args[0]}: Permission denied\n(Gợi ý: chạy ls -l /etc để xem vì sao bạn không đọc được file này.)`;
        else out = n.content;
      }
    } else out = `${name}: không tìm thấy lệnh. Gõ help để xem danh sách.`;

    setLines((l) => [...l, `${prompt(cwd)} ${cmdRaw}`, ...(out ? [out] : [])]);
    setCwd(nextCwd);
    finish(cmd, nextCwd);
  }

  function finish(cmd: string, newCwd: string) {
    setDoneTasks((d) => d.map((v, i) => v || TASKS[i].test(cmd, newCwd)));
    if (cmd) setHist((h) => [...h, cmd]);
    setHi(-1);
    setInput('');
  }

  return (
    <div className="sim term">
      <p className="sim-title">Terminal Linux giả lập</p>
      <div className="term-grid">
        <div className="term-box" ref={boxRef} onClick={() => boxRef.current?.querySelector('input')?.focus()}>
          {lines.map((l, i) => (
            <pre key={i} className="term-line">{l}</pre>
          ))}
          <form
            className="term-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
            }}
          >
            <span className="term-prompt">{prompt(cwd)}</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp' && hist.length) {
                  e.preventDefault();
                  const n = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1);
                  setHi(n);
                  setInput(hist[n]);
                }
              }}
              aria-label="Nhập lệnh"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </form>
        </div>
        <div className="term-tasks">
          <p className="cstep-h">Nhiệm vụ</p>
          <ol>
            {TASKS.map((t, i) => (
              <li key={i} className={doneTasks[i] ? 'is-done' : ''}>
                {t.text}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
