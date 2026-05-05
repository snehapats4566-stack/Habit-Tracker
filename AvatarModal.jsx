import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function AvatarModal({ isOpen, onClose, userProfile }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonSearch, setPokemonSearch] = useState('');
  const [loadingPokemon, setLoadingPokemon] = useState(false);

  // Fetch Pokemon data on mount or when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchPokemon = async () => {
      try {
        setLoadingPokemon(true);
        const pokemonIds = userProfile.POKEMON_AVATARS;
        const promises = pokemonIds.map(id =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(r => r.json())
            .catch(() => null)
        );
        const results = await Promise.all(promises);
        const filtered = results.filter(p => p !== null).map(p => ({
          id: p.id,
          name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
          image: p.sprites.other['official-artwork'].front_default || p.sprites.front_default,
        }));
        setPokemonList(filtered);
      } catch (error) {
        console.error('Failed to fetch Pokemon:', error);
      } finally {
        setLoadingPokemon(false);
      }
    };

    fetchPokemon();
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 20,
          maxWidth: 500,
          width: 'calc(100% - 32px)',
          maxHeight: '80vh',
          overflow: 'auto',
          zIndex: 1000,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            Choose Avatar
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="sf-input"
            placeholder="Search Pokémon..."
            value={pokemonSearch}
            onChange={(e) => setPokemonSearch(e.target.value.toLowerCase())}
            style={{ flex: 1 }}
          />
        </div>

        {/* Pokemon Grid */}
        {loadingPokemon ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
            Loading Pokémon...
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 10 }}>
            {pokemonList
              .filter(p => p.name.toLowerCase().includes(pokemonSearch) || p.id.toString().includes(pokemonSearch))
              .map(pokemon => (
                <button
                  key={pokemon.id}
                  onClick={() => {
                    userProfile.updateAvatar(`pokemon-${pokemon.id}`, pokemon.id);
                    onClose();
                  }}
                  title={`${pokemon.name} #${pokemon.id}`}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    background: userProfile.profile.pokemonId === pokemon.id ? 'var(--accent)' : 'var(--bg-input)',
                    border: userProfile.profile.pokemonId === pokemon.id ? '2px solid var(--text-primary)' : '1px solid var(--border)',
                    borderRadius: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    transition: 'all 200ms',
                    padding: '6px 4px 4px 4px',
                    gap: 2,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div style={{ 
                    width: 60, 
                    height: 50, 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        objectFit: 'contain',
                        display: 'block'
                      }}
                      onError={(e) => {
                        e.target.parentElement.innerHTML = '❓';
                      }}
                    />
                  </div>
                  <span style={{ 
                    fontSize: 8, 
                    fontWeight: 600, 
                    color: 'var(--text-primary)', 
                    textAlign: 'center', 
                    lineHeight: 1, 
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    padding: '0 2px'
                  }}>
                    {pokemon.name}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>
    </>
  );
}
