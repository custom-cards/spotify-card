import { h, Component } from 'preact';
import { useState } from 'preact/hooks';

const PlaylistType = () => {
  const [state, setState] = useState('All');
  const [showSelect, setShowSelect] = useState(false);
  const options = ['Users playlists', 'Featured playlists', 'Daily Mixes playlists'];

  const closeSelect = (e) => {
    (e) => setState(e.target.value);
    setShowSelect(false);
  };

  return (
    <div>
      {!showSelect && <div onClick={() => setShowSelect(true)}></div>}

      {showSelect && (
        <select class="playlist-type" onChange={closeSelect} onBlur={closeSelect}>
          {options.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default PlaylistType;
