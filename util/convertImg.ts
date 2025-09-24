const maxWidth = parseInt(process.env.NEXT_PUBLIC_MAX_IMAGE_WIDTH || "1024", 10);

export async function convertImageToJPG(file: File, quality: number = 0.95) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let {
                    width,
                    height
                } = img;
                if (width > maxWidth) {
                    height = Math.floor(height * (maxWidth / width));
                    width = maxWidth;
                }
                canvas.setAttribute(
                    'style',
                    `width: ${width}px; height: ${height}px`
                );
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    // Draw and possibly resize
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert canvas content to JPG data URL
                    const dataURL = canvas.toDataURL('image/jpeg', quality); // 0.8 is quality

                    // convert dataURL to a Blob or File object if needed
                    fetch(dataURL)
                        .then(res => res.blob())
                        .then(blob => {
                            const imageFile = new File([blob], file.name + '.jpg', {type: 'image/jpeg'});
                            resolve(imageFile);
                        })
                        .catch(reject);
                } else {
                    reject('Could not get canvas context');
                }
            };
            img.src = `${e.target.result}`;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}