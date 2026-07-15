import * as RadixSwitch from '@radix-ui/react-switch';
import styles from './styles.module.css';

interface Props {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ label, ...props }: Props) {
  return (
    <RadixSwitch.Root className={styles.root} aria-label={label} {...props}>
      <RadixSwitch.Thumb className={styles.thumb} />
    </RadixSwitch.Root>
  );
}
