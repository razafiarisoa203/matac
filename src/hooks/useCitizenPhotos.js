import { useState, useEffect } from 'react';
import axios from 'axios';
import { buildCitizenPhotoUrl } from '../utils/urlHelper';

export const useCitizenPhotos = (users) => {
  const [photos, setPhotos] = useState({});

  useEffect(() => {
    users.forEach((user) => {
      if (user?.id_citizen && !photos[user.id_citizen]) {
        axios
          .get(`https://gateway.tsirylab.com/serviceauth/users/user-citizen/${user.id_citizen}`)
          .then((res) => {
            const photoPath = res.data?.citizen?.citizen_photo;
            const fullPhotoUrl = buildCitizenPhotoUrl(photoPath);

            setPhotos((prev) => ({
              ...prev,
              [user.id_citizen]: fullPhotoUrl,
            }));
          })
          .catch((err) => {
            console.error('Erreur fetch photo:', err);
            setPhotos((prev) => ({ ...prev, [user.id_citizen]: null }));
          });
      }
    });
  }, [users]);

  return photos;
};