import React, { useState } from 'react';

const PlayerListItem = ({ player, onRemove, onEdit }) => {
  const [isEditing, setEditing] = useState(false);
  const [values, setValues] = useState({ ...player });

  const handleToggleEdit = () => {
    if (isEditing) {
      setValues({ ...player });
    }
    setEditing(!isEditing);
  };

  const handleEdit = (key, e) => {
    const newValue = e.target.value;
    setValues({ ...values, [key]: newValue });
  };

  const handleSave = () => {
    onEdit(values);
    setEditing(false);
  };

  const { _id, __v, ...rest } = player;

  const formattedValue = (value) => isNaN(value) ? value : (value % 1 !== 0) ? value.toFixed(1) : value;

  return (
    <tr>
      {Object.keys(rest).map((key) => (
        <td key={'player_' + key}>
          {isEditing ? (
            <input
              key={'player_' + key + '_editable'}
              type={typeof player[key]}
              value={formattedValue(values[key])}
              onChange={(e) => handleEdit(key, e)}
            />
          ) : (
            formattedValue(player[key])
          )}
        </td>
      ))}
      <td>
        <div className='d-flex justify-content-end'>
          {isEditing && (
            <>
              <button
                className='btn btn-success btn-sm me-2'
                onClick={handleSave}
              >
                Done
              </button>
              <button className='btn btn-danger btn-sm me-2' onClick={onRemove}>
                Delete
              </button>
            </>
          )}
          <button
            className='btn btn-outline-dark btn-sm'
            onClick={handleToggleEdit}
          >
            {isEditing ? 'Close' : 'Edit'}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PlayerListItem;
