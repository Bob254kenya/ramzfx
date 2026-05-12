// RAMZFX Brand Logo - Blue & Red with Animation

type TBrandLogoProps = {
    width?: number;
    height?: number;
    fill?: string;
    className?: string;
};

export const BrandLogo = ({
    width = 200,
    height = 32,
    fill = 'currentColor',
    className = ''
}: TBrandLogoProps) => {
    return (
        <div 
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: width,
                height: height,
            }}
        >
            {/* Animated gradient square logo mark - Blue to Red */}
            <div
                style={{
                    width: '98px',
                    height: '28px',
                    background: 'linear-gradient(135deg, #fa23d3, #0d3fc7)',
                    backgroundSize: '200% 200%',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'gradientShift 3s ease infinite',
                    boxShadow: '0 2px 8px rgba(30, 58, 95, 0.3)',
                }}
            >
                <span
                    style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        animation: 'pulse 1.5s ease infinite',
                    }}
                >
                    R
                </span>
            </div>
            
            {/* Brand name text with gradient */}
            <span
                style={{
                    background: 'linear-gradient(135deg, #1e3a5f, #ff3b30)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 800,
                    fontSize: '18px',
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    letterSpacing: '0.5px',
                    animation: 'textGradient 3s ease infinite',
                }}
            >
                RAMZFX
            </span>

            {/* Add animation keyframes to document */}
            <style>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes textGradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.9; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};