import React, { useState } from 'react';
import { trimDecimals } from '../lib/helpers';

const LadderPlayerItem = ({ player }) => {
  const [values, setValues] = useState({ ...player });

  const { _id, __v, ...rest } = player;

  return (
    <tr>
        <td>
          {player.ladderPosition}
        </td>
        <td>
          {player.name}
        </td>
    </tr>
  );
};

export default LadderPlayerItem;
