import type { ButtonHTMLAttributes } from 'react';
import styles from './styles.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', className, ...props }: Props) {
  const classes = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(' ');
  return <button className={classes} {...props} />;
}
