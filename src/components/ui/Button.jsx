import { buttonClass } from './buttonStyles'

export function Button({ variant, size, className, type = 'button', ...props }) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...props} />
}

// External destinations open in a new tab; internal files (the résumé) do too, so the portfolio stays open.
export function ButtonLink({ variant, size, className, external = true, ...props }) {
  const target = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return <a className={buttonClass({ variant, size, className })} {...target} {...props} />
}
