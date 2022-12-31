import Image from 'next/image';

export default function QWizard_logo() {
    return (
        <Image
            src="/logo.svg" // Route of the image file
            height={100} // Desired size with correct aspect ratio
            width={250} // Desired size with correct aspect ratio
            alt="Qwizard Logo"
        />
    )
}

