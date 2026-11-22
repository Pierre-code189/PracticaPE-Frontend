import { initials } from '../api/utils';

export default function Avatar({ name, src, size = 48 }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size, objectFit: 'cover' }}
        className="rounded-full"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className="rounded-full flex items-center justify-center font-extrabold"
      style={{ width: size, height: size, fontSize: size * 0.4,
               background: 'linear-gradient(90deg,#0CE0E5,#5B2EFF)' }}
    >
      {initials(name)}
    </div>
  );
}
