import { useState, useCallback } from 'react';

const PROFILE_KEY = 'streakflow_user_profile';

const DEFAULT_AVATARS = [
  { id: 'avatar1', emoji: '👨‍💼', label: 'Professional' },
  { id: 'avatar2', emoji: '👩‍💻', label: 'Developer' },
  { id: 'avatar3', emoji: '🧑‍🎨', label: 'Creative' },
  { id: 'avatar4', emoji: '🏋️', label: 'Fitness' },
  { id: 'avatar5', emoji: '📚', label: 'Student' },
  { id: 'avatar6', emoji: '🎯', label: 'Goal Setter' },
  { id: 'avatar7', emoji: '🚀', label: 'Hustler' },
  { id: 'avatar8', emoji: '🧘', label: 'Mindful' },
  { id: 'avatar9', emoji: '👑', label: 'Champion' },
  { id: 'avatar10', emoji: '🌟', label: 'Star' },
  { id: 'avatar11', emoji: '🎸', label: 'Artist' },
  { id: 'avatar12', emoji: '🍃', label: 'Nature' },
];

// All Gen 1 & Gen 2 Pokémon plus popular Gen 3 picks
const POKEMON_AVATARS = [
  // Gen 1 (1–151) - all
  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
  21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,
  41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,
  61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,
  81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,
  101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,
  121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,
  141,142,143,144,145,146,147,148,149,150,151,
  // Gen 2 (152–251) - all
  152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,
  172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,
  192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,
  212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,
  232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,
  // Popular Gen 3 picks
  252,253,254,255,256,257,258,259,260,261,263,265,270,273,276,278,280,
  282,287,289,293,298,300,302,303,304,307,311,312,315,318,320,325,327,
  333,335,337,338,339,341,343,345,347,349,351,352,355,357,359,361,363,
  370,371,374,375,376,377,378,379,380,381,382,383,384,385,386,
];

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      return {
        name: 'You',
        avatar: 'pokemon-25',
        pokemonId: 25,
        bio: '',
        color: '#22c55e',
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      name: 'You',
      avatar: 'pokemon-25',
      pokemonId: 25,
      bio: '',
      color: '#22c55e',
    };
  }
}

function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export default function useUserProfile() {
  const [profile, setProfile] = useState(() => loadProfile());

  const updateProfile = useCallback((updates) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      saveProfile(next);
      return next;
    });
  }, []);

  const updateName = useCallback((name) => {
    updateProfile({ name: name.trim() || 'You' });
  }, [updateProfile]);

  const updateAvatar = useCallback((avatar, pokemonId = null) => {
    if (pokemonId) {
      // Fetch the actual image URL from the API
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then(r => r.json())
        .then(data => {
          const imageUrl = data.sprites.other['official-artwork'].front_default || data.sprites.front_default || '';
          updateProfile({ 
            avatar: `pokemon-${pokemonId}`, 
            pokemonId,
            pokemonImageUrl: imageUrl
          });
        })
        .catch(() => {
          // Fallback if API fails
          updateProfile({ avatar: `pokemon-${pokemonId}`, pokemonId });
        });
    } else {
      updateProfile({ avatar });
    }
  }, [updateProfile]);

  const updateBio = useCallback((bio) => {
    updateProfile({ bio: bio.slice(0, 100) });
  }, [updateProfile]);

  const updateColor = useCallback((color) => {
    updateProfile({ color });
  }, [updateProfile]);

  const getPokemonImageUrl = useCallback((pokemonId) => {
    // Try multiple image sources
    // First try: Official artwork from PokéAPI CDN
    // Second fallback: Standard sprite from PokéAPI
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${pokemonId}.png`;
  }, []);

  const getAvatarEmoji = useCallback((avatarId) => {
    const avatar = DEFAULT_AVATARS.find(a => a.id === avatarId);
    return avatar?.emoji || '👤';
  }, []);

  return {
    profile,
    updateProfile,
    updateName,
    updateAvatar,
    updateBio,
    updateColor,
    getAvatarEmoji,
    getPokemonImageUrl,
    DEFAULT_AVATARS,
    POKEMON_AVATARS,
  };
}
