import { useEffect } from 'react';

const SEO = ({ title, description, image, type = 'website' }) => {
    useEffect(() => {
        const siteTitle = "Electro-05 | L'électronique intelligente au Maroc";
        const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
        document.title = fullTitle;

        // Update Meta Tags
        const updateMeta = (name, content) => {
            if (!content) return;
            let el = document.querySelector(`meta[name="${name}"]`) ||
                document.querySelector(`meta[property="${name}"]`);
            if (el) {
                el.setAttribute('content', content);
            } else {
                const newMeta = document.createElement('meta');
                if (name.startsWith('og:')) {
                    newMeta.setAttribute('property', name);
                } else {
                    newMeta.setAttribute('name', name);
                }
                newMeta.setAttribute('content', content);
                document.head.appendChild(newMeta);
            }
        };

        if (description) {
            updateMeta('description', description);
            updateMeta('og:description', description);
        }

        updateMeta('og:title', fullTitle);
        updateMeta('og:type', type);
        if (image) updateMeta('og:image', image);

    }, [title, description, image, type]);

    return null;
};

export default SEO;
