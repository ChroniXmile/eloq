import { cn } from '@/lib/utils'
import { Trophy } from 'lucide-react'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <div className="pool-table-bg w-6 h-6 rounded-full flex items-center justify-center">
                <Trophy className="h-3.5 w-3.5 text-white" />
            </div>
            <span 
                className={cn('font-bold text-lg', uniColor ? 'text-foreground' : 'bg-clip-text text-transparent bg-gradient-to-r from-[#9B99FE] to-[#2BC8B7]')}>
                ELOQ
            </span>
        </div>
    )
}

export const LogoIcon = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center', className)}>
            <div className="pool-table-bg w-5 h-5 rounded-full flex items-center justify-center">
                <Trophy className="h-3 w-3 text-white" />
            </div>
        </div>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <div className="pool-table-bg w-6 h-6 rounded-full flex items-center justify-center border border-current">
                <Trophy className="h-3.5 w-3.5 text-current" />
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#9B99FE] to-[#2BC8B7]">
                ELOQ
            </span>
        </div>
    )
}