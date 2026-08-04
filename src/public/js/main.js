document.addEventListener('DOMContentLoaded', function() {
  initMediaOffcanvas();
  initMediaUpload();
  initUserSelection();
});

function initMediaOffcanvas() {
  const offcanvas = document.getElementById('offcanvasRight');
  if (!offcanvas) return;

  offcanvas.addEventListener('show.bs.offcanvas', function(event) {
    const trigger = event.relatedTarget;
    if (!trigger) return;

    const name = trigger.dataset.name;
    const alt = trigger.dataset.alt || '';
    const url = trigger.dataset.url;
    const markdown = trigger.dataset.markdown || `![${name}](${url})`;

    document.getElementById('mediaPreview').src = url;
    document.getElementById('mediaPreview').alt = alt || name;
    document.getElementById('mediaName').textContent = name;
    document.getElementById('mediaMarkdownPath').textContent = markdown;
    document.getElementById('originalName').value = name;
    document.getElementById('editName').value = name;
    document.getElementById('editAlt').value = alt;
  });

  document.getElementById('mediaEditForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = {
      name: formData.get('originalName'),
      newName: formData.get('newName'),
      alt: formData.get('alt')
    };

    fetch('/dashboard/media/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(r => r.json())
      .then(result => {
        if (result.success) {
          location.reload();
        } else {
          alert('Error: ' + result.error);
        }
      })
      .catch(err => alert('Error de red: ' + err.message));
  });

  document.getElementById('deleteMediaBtn').addEventListener('click', function() {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;

    const name = document.getElementById('originalName').value;

    fetch('/dashboard/media/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
      .then(r => r.json())
      .then(result => {
        if (result.success) {
          location.reload();
        } else {
          alert('Error: ' + result.error);
        }
      })
      .catch(err => alert('Error de red: ' + err.message));
  });
}

function initMediaUpload() {
  const uploadForm = document.getElementById('uploadForm');
  if (!uploadForm) return;

  uploadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('/dashboard/media/upload', {
      method: 'POST',
      body: formData
    })
      .then(r => r.json())
      .then(result => {
        if (result.success) {
          location.reload();
        } else {
          alert('Error: ' + result.error);
        }
      })
      .catch(err => alert('Error de red: ' + err.message));
  });
}

function initUserSelection() {
  const selectAll = document.getElementById('selectAll');
  if (!selectAll) return;

  selectAll.addEventListener('change', function() {
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = this.checked);
    updateUserButtons();
  });

  document.querySelectorAll('.row-checkbox').forEach(cb => {
    cb.addEventListener('change', updateUserButtons);
  });

  document.getElementById('editSelectedBtn').addEventListener('click', function() {
    const selected = document.querySelector('.row-checkbox:checked');
    if (selected) {
      window.location.href = '/dashboard/users/' + selected.value + '/edit';
    }
  });

  document.getElementById('deleteSelectedBtn').addEventListener('click', function() {
    const selected = document.querySelectorAll('.row-checkbox:checked');
    if (selected.length === 0) return;
    if (!confirm('¿Eliminar ' + selected.length + ' usuario(s)?')) return;

    const ids = Array.from(selected).map(cb => cb.value);

    fetch('/dashboard/users/delete-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    })
      .then(r => r.json())
      .then(result => {
        if (result.success) {
          location.reload();
        } else {
          alert('Error: ' + result.error);
        }
      })
      .catch(err => alert('Error de red: ' + err.message));
  });
}

function updateUserButtons() {
  const selected = document.querySelectorAll('.row-checkbox:checked');
  const editBtn = document.getElementById('editSelectedBtn');
  const deleteBtn = document.getElementById('deleteSelectedBtn');
  if (editBtn) editBtn.disabled = selected.length !== 1;
  if (deleteBtn) deleteBtn.disabled = selected.length === 0;
}
