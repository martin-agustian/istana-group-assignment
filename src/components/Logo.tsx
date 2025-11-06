import Image from "next/image";
import type { CSSProperties } from "react";

type LogoProps =  {
	style?: CSSProperties
};

const Logo = ({ style }: LogoProps) => {
	return (
		<Image 
			src="/logo-istana.png" width={175} height={187} alt="Hero img" 
			style={{ maxWidth: "100%", height: "auto", cursor: "pointer", ...style }} priority />
	);
};

export default Logo;
