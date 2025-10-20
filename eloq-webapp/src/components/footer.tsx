import { Logo } from '@/components/logo'
import Link from 'next/link'

const links = [
    {
        title: 'Home',
        href: '/',
    },
    {
        title: 'Players',
        href: '/players',
    },
    {
        title: 'Tournaments',
        href: '/tournaments',
    },
    {
        title: 'Rankings',
        href: '/',
    },
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'About',
        href: '/about',
    },
]

const socialLinks = [
    {
        name: 'GitHub',
        href: 'https://github.com/eloq-project',
        ariaLabel: 'GitHub repository',
        icon: (
            <svg
                className="size-6"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"></path>
            </svg>
        )
    },
    {
        name: 'Discord',
        href: 'https://discord.gg/eloq',
        ariaLabel: 'Discord community',
        icon: (
            <svg
                className="size-6"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 127.14 96.36">
                <path
                    fill="currentColor"
                    d="M107.7 3.33a103.33 103.33 0 0 0-21.37-3.33c-7.3 0-14.2 1.34-20.6 3.33a83.93 83.93 0 0 0-61.36 74.25A103.32 103.32 0 0 0 25.74 80.4a11.78 11.78 0 0 1 13.8-1.67 63.43 63.43 0 0 1-9.4 30.5 109.71 109.71 0 0 0 59.86 18.19h.2c5.7 0 11.2-1.09 16.4-3.08a83.93 83.93 0 0 0 18.7-7.73A84.8 84.8 0 0 0 127 24.1a80.5 80.5 0 0 0-19.3-20.77zM41.14 61.11c-6.8 0-12.4-6.5-12.4-14.4 0-7.8 5.4-14.4 12.4-14.4s12.4 6.5 12.4 14.4c.1 7.9-5.5 14.4-12.4 14.4zm44.8 0c-6.8 0-12.4-6.5-12.4-14.4 0-7.8 5.4-14.4 12.4-14.4s12.4 6.5 12.4 14.4c0 7.9-5.6 14.4-12.4 14.4z"></path>
            </svg>
        )
    },
    {
        name: 'Twitter',
        href: 'https://twitter.com/eloqproject',
        ariaLabel: 'Twitter',
        icon: (
            <svg
                className="size-6"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"></path>
            </svg>
        )
    }
]

export default function FooterSection() {
    return (
        <footer className="py-8 md:py-12 bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto max-w-5xl px-6">
                <Link
                    href="/"
                    aria-label="go home"
                    className="mx-auto block size-fit">
                    <Logo />
                </Link>

                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-muted-foreground hover:text-primary block duration-150">
                            <span>{link.title}</span>
                        </Link>
                    ))}
                </div>
                
                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    {socialLinks.map((social, index) => (
                        <Link
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.ariaLabel}
                            className="text-muted-foreground hover:text-primary block">
                            {social.icon}
                        </Link>
                    ))}
                </div>
                
                <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-center text-sm text-muted-foreground mb-2">
                        ELOQ - Modern pool/billiards score tracking and ranking system
                    </p>
                    <p className="text-center text-sm text-muted-foreground mb-4">
                        Made with ❤️ for the Pool Community
                    </p>
                    <span className="text-muted-foreground block text-center text-sm"> 
                        © {new Date().getFullYear()} ELOQ Pool Rating System, All rights reserved
                    </span>
                </div>
            </div>
        </footer>
    )
}
