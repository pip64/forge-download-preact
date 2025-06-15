import { useEffect, useState } from "react";
import installForgeVersion from "../utils/installForgeVersion";

export default function () {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchForgeVersions() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch("https://maven.minecraftforge.net/net/minecraftforge/forge/maven-metadata.xml");
                const xmlText = await response.text();

                const parser = new DOMParser();
                const xml = parser.parseFromString(xmlText, "text/xml");

                const versionElements = xml.querySelectorAll("version");
                const versions = Array.from(versionElements)
                    .map(el => el.textContent)
                    .filter(v => /^\d+\.\d+(\.\d+)?-\d+\.\d+\.\d+$/.test(v))

                const formatted = versions.map(version => {
                    const fileName = `forge-${version}-installer.jar`;
                    const downloadUrl = `https://maven.minecraftforge.net/net/minecraftforge/forge/${version}/${fileName}`;

                    return {
                        id: version,
                        displayName: version,
                        fileName,
                        downloadUrl,
                        download: () => installForgeVersion(version, fileName),
                    };
                })

                setData(formatted.filter(Boolean));
            } catch (err) {
                setError(err.message || "Unknown error while fetching Forge versions");
            }

            setIsLoading(false);
        }

        fetchForgeVersions();
    }, []);

    return { data, error, isLoading };
}
