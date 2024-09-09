import Image from 'next/image'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function GoogleButton() {
  const googleUrl = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL

  return (
    <a
      href={googleUrl}
      className={cn(
        buttonVariants({ variant: 'default' }),
        'w-full gap-2 py-6',
      )}
    >
      <Image
        src="/google-logo.svg"
        alt="Logotipo do Google"
        width={16}
        height={16}
      />
      Continuar com Google
    </a>
  )
}
