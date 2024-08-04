import React from 'react';

const Avatar = ({ img,name }) => {
    const getInitials = (name) => {
        if (!name) return '';
        const nameArray = name.split(' ');
        const initials = nameArray.map(n => n[0]).join('');
        return initials;
    };

    return (
        <div>
            {img? (<div  style={{margin:"5px"}}>
                <img src={img} alt="Profile" className="profile-image" />

            </div>
            ) : (
                <div className="initials">
                    {getInitials(name)}
                </div>
            )}
        </div>
    );
};

export default Avatar;
