import { cn } from '@/lib/utils';
import styles from './test.module.scss';

export default function AlarmPage() {
  return (
    <div
      className={cn(
        'flex-1 flex p-6 gap-6 overflow-hidden text-slate-200',
        styles.alarm
      )}
    ></div>
  );
}
