document.addEventListener('DOMContentLoaded', async function () {
  let usuario = {};

  // 1. Manejo de errores al obtener el usuario
  try {
    usuario = (await obtenerUsuarioActual()) || {};
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
  }

  // Renderizar avatar del usuario actual
  const foroCurrentAvatar = document.getElementById('foro-current-avatar');
  if (foroCurrentAvatar) {
    if (usuario.foto_perfil) {
      foroCurrentAvatar.innerHTML = `
        <img src="http://localhost:3000/${usuario.foto_perfil}" alt="Foto de perfil" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
      `;
    } else {
      foroCurrentAvatar.textContent = usuario.username ? usuario.username.charAt(0).toUpperCase() : '?';
    }
  }

  const rol = usuario.role || 'publico';
  const newPostCard = document.getElementById('new-post-card');

  if (newPostCard) {
    newPostCard.style.display = rol === 'admin' || rol === 'lider' ? 'block' : 'none';
  }

  await cargarNavbar('foro');

  // Cargar proyectos en el select
  const projectSelect = document.getElementById('post-project');
  const token = localStorage.getItem('token');

  if (token && projectSelect) {
    try {
      const response = await fetch('http://localhost:3000/api/forum/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const proyectos = await response.json();
        proyectos.forEach(function (proyecto) {
          projectSelect.innerHTML += `
            <option value="${proyecto.id_proyecto}">${proyecto.nombre}</option>
          `;
        });
      }
    } catch (error) {
      console.error('Error cargando proyectos:', error);
    }
  }

  // Publicar un nuevo Post
  const publishBtn = document.getElementById('publish-post-btn');
  const postText = document.getElementById('post-text');

  const postMedia =
    document.getElementById('post-media');

  if (publishBtn && postText && projectSelect) {
    publishBtn.addEventListener('click', async function () {
      const texto = postText.value.trim();
      const id_proyecto = projectSelect.value;

      if (!id_proyecto || !texto) {
        alert('Es necesario que tu públicación este relacionada a un proyecto, selecciona uno para publicar');
        return;
      }

      try {

          const formData =
            new FormData();

          formData.append(
            'texto',
            texto
          );

          formData.append(
            'id_proyecto',
            id_proyecto
          );

          if (
            postMedia &&
            postMedia.files[0]
          ) {
            formData.append(
              'multimedia_publi',
              postMedia.files[0]
            );
          }

          const response = await fetch(
            'http://localhost:3000/api/forum/posts',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`
              },
              body: formData
            }
          );

        const data = await response.json();

        if (response.ok) {
          alert('Publicación creada correctamente ✅');
          window.location.reload();
        } else {
          alert(data.mensaje || 'Error creando publicación');
        }
      } catch (error) {
        alert('Error de conexión al crear publicación');
      }
    });
  }

  // Cargar Posts y Comentarios
  const postsContainer = document.getElementById('foro-posts');

  if (postsContainer) {
    try {
      const responsePosts = await fetch('http://localhost:3000/api/forum/posts');
      const posts = await responsePosts.json();

      postsContainer.innerHTML = '';

      posts.forEach(function (post) {
        const avatar = post.foto_perfil
          ? `<img src="http://localhost:3000/${post.foto_perfil}" alt="Foto de perfil" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
          : post.username ? post.username.charAt(0).toUpperCase() : '?';

        postsContainer.innerHTML += `
          <div class="foro-post-full">
            <div class="post-header">
              <a href="lider-perfil.html?id=${post.id_usuario}" class="avatar avatar-md" style="background:linear-gradient(135deg,#1e40af,#3b82f6);">
                ${avatar}
              </a>
              <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                  <a href="lider-perfil.html?id=${post.id_usuario}" style="font-weight:700;font-size:14px;color:var(--gris-900);">
                    ${post.username}
                  </a>
                  <span class="tag tag-azul">${post.nombre_proyecto}</span>
                  
                  ${rol === 'admin' ? `
                    <button class="btn btn-sm delete-post-btn" data-post-id="${post.id_publi}" style="margin-left:auto; background:#fee2e2; color:#991b1b;">
                      🗑️ Eliminar
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>

            <div class="post-body">

              ${post.texto}

              ${
                post.multimedia_publi
                  ? `
                    <div
                      style="
                        margin-top:12px;
                      "
                    >
                      <img
                        src="http://localhost:3000/${post.multimedia_publi}"
                        alt="Imagen publicación"
                        style="
                          width:100%;
                          max-height:500px;
                          object-fit:cover;
                          border-radius:12px;
                        "
                      >
                    </div>
                  `
                  : ''
              }

            </div>

            <div class="post-comments">
              ${post.comentarios ? post.comentarios.map(function (comentario) {
                const avatarComentario = comentario.foto_perfil
                  ? `<img src="http://localhost:3000/${comentario.foto_perfil}" alt="Foto" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`
                  : comentario.username ? comentario.username.charAt(0).toUpperCase() : '?';

                return `
                  <div style="display:flex; gap:10px; margin-top:10px; align-items:flex-start;">
                    <div class="avatar avatar-sm">${avatarComentario}</div>
                    <div style="background:#f8fafc; padding:10px; border-radius:12px; flex:1;">
                      <div style="font-weight:600; font-size:13px;">${comentario.username}</div>
                      <div>${comentario.texto}</div>
                      
                      ${rol === 'admin' ? `
                        <button class="delete-comment-btn" data-comment-id="${comentario.id_comentario}" style="border:none; background:transparent; color:#991b1b; cursor:pointer; font-size:12px; margin-top:4px; padding:0;">
                          🗑️ Eliminar comentario
                        </button>
                      ` : ''}
                    </div>
                  </div>
                `;
              }).join('') : ''}

              ${rol === 'admin' || rol === 'lider' ? `
                <div style="display:flex; gap:10px; margin-top:14px;">
                  <input class="form-input comment-input" data-post-id="${post.id_publi}" placeholder="Escribe un comentario..." style="flex:1;">
                  <button class="btn btn-primary btn-sm comment-btn" data-post-id="${post.id_publi}">
                    Comentar
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      });

      // Delegación de eventos global para el contenedor de posts (Clicks dinámicos)
      postsContainer.addEventListener('click', async function (e) {
        const target = e.target;

        // --- ACCIÓN: COMENTAR ---
        if (target && target.classList.contains('comment-btn')) {
          const postId = target.dataset.postId;
          const input = postsContainer.querySelector(`.comment-input[data-post-id="${postId}"]`);
          const texto = input.value.trim();

          if (!texto) {
            alert('Escribe un comentario');
            return;
          }

          try {
            const response = await fetch(`http://localhost:3000/api/forum/posts/${postId}/comments`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ texto })
            });

            const data = await response.json();
            if (response.ok) {
              window.location.reload();
            } else {
              alert(data.mensaje || 'Error creando comentario');
            }
          } catch (error) {
            alert('Error de conexión al enviar comentario');
          }
        }

        // --- ACCIÓN: ELIMINAR POST ---
        if (target && target.classList.contains('delete-post-btn')) {
          if (!confirm('¿Eliminar esta publicación?')) return;

          const postId = target.dataset.postId;

          try {
            const response = await fetch(`http://localhost:3000/api/forum/posts/${postId}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
              window.location.reload();
            } else {
              alert('Error eliminando publicación');
            }
          } catch (error) {
            alert('Error de conexión al eliminar la publicación');
          }
        }

        // --- ACCIÓN: ELIMINAR COMENTARIO ---
        if (target && target.classList.contains('delete-comment-btn')) {
          if (!confirm('¿Eliminar este comentario?')) return;

          const commentId = target.dataset.commentId;

          try {
            const response = await fetch(`http://localhost:3000/api/forum/comments/${commentId}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
              window.location.reload();
            } else {
              alert('Error eliminando comentario');
            }
          } catch (error) {
            alert('Error de conexión al eliminar el comentario');
          }
        }
      });

    } catch (error) {
      console.error('Error cargando el foro:', error);
    }
  }
});