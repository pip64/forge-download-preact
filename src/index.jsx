import { render } from 'preact';

import './style.css';
import useFabricVersions from "./hooks/useGetForgeVersions";

export function App() {
  const { data, error, isLoading } = useFabricVersions();

  return (
    <main class="container">
      {data ? data.map(version => (
        <div key={version.id}>
          <h1>{version?.displayName || "No version number"}</h1>
          <h2>
            <button onClick={version.download}>Download</button>
          </h2>
        </div>
      )) : null}

      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </main>
  );
}

render(<App />, document.getElementById('app'));
