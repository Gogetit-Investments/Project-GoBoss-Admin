import Image from 'next/image';
import Link from '@/components/ui/link';
import cn from 'classnames';
import { siteSettings } from '@/settings/site.settings';
import { useSettings } from '@/contexts/settings.context';

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  ...props
}) => {
  const { logo, siteTitle } = useSettings();
  return (
    <Link
      href={siteSettings.logo.href}
      className={cn('inline-flex', className)}
      {...props}
    >
      <span
      
      className="relative "
      // className="relative overflow-hidden"
      style={{
        width: 270,
        height: 60,
        display: 'flex', alignItems: 'center', 
      }}
    >
        <Image
          src = {'/admin/image/logo.jpeg'}
          // src={logo?.original ?? siteSettings.logo.url}
          alt={siteTitle ?? siteSettings.logo.alt}
          layout="fixed"
          objectFit="contain"
          loading="eager"
          width={150} // Set the desired width of the image
          height={60}// Set the desired height of the image
        />
      </span>
    </Link>
  );
};

export default Logo;
