import { cn } from '@/lib/utils';

import styles from './test.module.scss';

export default function AlarmPage() {
  return (
    <div
      className={cn(
        'flex flex-1 gap-6 overflow-hidden p-6 text-slate-200',
        styles.alarm
      )}
    ></div>
  );
}
