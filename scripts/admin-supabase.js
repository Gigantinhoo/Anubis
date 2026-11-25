import { supabase } from "./supabase-client.js";

const $ = id => document.getElementById(id);
let session = null;
let properties = [];
let selectedId = null;
let galleryDraft = [];
let busy = false;

const STATUS_LABELS = {
  available: "Disponível",
  unavailable: "Indisponível",
  soon: "Em breve",
  rented: "Alugado",
  draft: "Rascunho",
  demo: "Demonstração"
};

function showMessage(id, text, kind = "") {
  const box = $(id);
  box.textContent = text;
  box.className = "message" + (kind ? " " + kind : "");
  box.hidden = !text;
}

function slugify(value) {
  return String(value || "imovel")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "imovel";
}

function uniqueSlug(title, exceptId = null, used = properties) {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;
  while (used.some(item => item.id !== exceptId && item.slug === candidate)) {
    candidate = base + "-" + suffix++;
  }
  return candidate;
}

function numberOrNull(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function dateOrNull(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")) ? value : null;
}

function validStatus(value) {
  return ["available", "unavailable", "soon", "rented", "draft", "demo"].includes(value)
    ? value
    : "draft";
}

function normalizeGallery(row) {
  const source = Array.isArray(row.gallery) ? row.gallery : [];
  const gallery = source.map((item, index) => typeof item === "string"
    ? { src: item, alt: "Foto " + (index + 1) }
    : { src: item?.src || "", alt: item?.alt || "Foto " + (index + 1) }
  ).filter(item => item.src);
  if (!gallery.length && row.image) gallery.push({ src: row.image, alt: "Foto de " + (row.title || "imóvel") });
  return gallery;
}

function showLogin() {
  $("login-view").hidden = false;
  $("not-admin-view").hidden = true;
  $("dashboard-view").hidden = true;
  $("user-toolbar").hidden = true;
}

function showAdminSetup(user) {
  $("login-view").hidden = true;
  $("not-admin-view").hidden = false;
  $("dashboard-view").hidden = true;
  $("user-toolbar").hidden = true;
  $("user-id").textContent = user.id;
  $("admin-sql").textContent =
    "insert into public.admin_users (user_id) values ('" + user.id + "'::uuid) on conflict do nothing;";
}

async function showDashboard(user) {
  $("login-view").hidden = true;
  $("not-admin-view").hidden = true;
  $("dashboard-view").hidden = false;
  $("user-toolbar").hidden = false;
  $("signed-email").textContent = user.email || "Administrador";
  await loadProperties();
}

async function handleSession(nextSession) {
  session = nextSession;
  if (!session) {
    showLogin();
    return;
  }

  $("login-view").hidden = true;
  $("not-admin-view").hidden = true;
  $("dashboard-view").hidden = true;
  $("user-toolbar").hidden = true;

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (error) {
    showAdminSetup(session.user);
    showMessage("setup-message",
      "Não foi possível verificar a permissão. Confira se o esquema inicial do Supabase foi aplicado. Detalhe: " + error.message,
      "error");
    return;
  }

  if (!data) {
    showAdminSetup(session.user);
    return;
  }
  await showDashboard(session.user);
}

async function loadProperties() {
  const list = $("property-list-items");
  list.replaceChildren();
  $("property-count").textContent = "Carregando imóveis...";

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    showMessage("dashboard-message", "Falha ao carregar imóveis: " + error.message, "error");
    return;
  }

  properties = (data || []).map(row => ({
    ...row,
    price: row.price === null ? null : Number(row.price),
    bedrooms: row.bedrooms === null ? null : Number(row.bedrooms),
    bathrooms: row.bathrooms === null ? null : Number(row.bathrooms),
    gallery: normalizeGallery(row)
  }));

  $("property-count").textContent = properties.length + (properties.length === 1 ? " imóvel" : " imóveis");
  renderList();

  if (selectedId && properties.some(item => item.id === selectedId)) selectProperty(selectedId);
  else if (properties.length) selectProperty(properties[0].id);
  else startNew();
}

function renderList() {
  const list = $("property-list-items");
  list.replaceChildren();

  if (!properties.length) {
    const empty = document.createElement("p");
    empty.className = "helper";
    empty.textContent = "Nenhum imóvel no banco. Importe o catálogo antigo ou crie o primeiro anúncio.";
    list.append(empty);
    return;
  }

  properties.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    if (item.id === selectedId) button.classList.add("active");
    const title = document.createElement("strong");
    title.textContent = item.title || "Imóvel sem título";
    const subtitle = document.createElement("small");
    subtitle.textContent = (STATUS_LABELS[item.status] || item.status) + (item.is_demo ? " · Anúncio demonstrativo" : "");
    button.append(title, subtitle);
    button.addEventListener("click", () => selectProperty(item.id));
    list.append(button);
  });
}

function setForm(row) {
  $("title").value = row.title || "";
  $("price").value = row.price === null || row.price === undefined ? "" : row.price;
  $("status").value = row.status || "available";
  $("neighborhood").value = row.neighborhood || "";
  $("bedrooms").value = row.bedrooms ?? "";
  $("bathrooms").value = row.bathrooms ?? "";
  $("area").value = row.area || "";
  $("badge").value = row.badge || "";
  $("features").value = row.features || "";
  $("description").value = row.description || "";
  $("available-from").value = row.available_from || "";
  $("date-listed").value = row.date_listed || "";
  $("whatsapp-message").value = row.whatsapp_message || "";
  $("is-demo").checked = Boolean(row.is_demo);
}

function cleanupDraftUrls() {
  galleryDraft.forEach(photo => {
    if (photo.localUrl) URL.revokeObjectURL(photo.localUrl);
  });
}

function renderGallery() {
  const host = $("gallery-grid");
  host.replaceChildren();

  if (!galleryDraft.length) {
    const empty = document.createElement("p");
    empty.className = "helper";
    empty.textContent = "Nenhuma foto adicionada.";
    host.append(empty);
    return;
  }

  galleryDraft.forEach((photo, index) => {
    const card = document.createElement("div");
    card.className = "gallery-item";
    const image = document.createElement("img");
    image.src = photo.localUrl || photo.src;
    image.alt = photo.alt || "Foto " + (index + 1);
    image.loading = "lazy";
    const label = document.createElement("p");
    label.textContent = photo.alt || "Foto " + (index + 1);
    const remove = document.createElement("button");
    remove.className = "admin-button danger";
    remove.type = "button";
    remove.textContent = "Remover";
    remove.addEventListener("click", () => {
      const removed = galleryDraft.splice(index, 1)[0];
      if (removed?.localUrl) URL.revokeObjectURL(removed.localUrl);
      renderGallery();
    });
    card.append(image, label, remove);
    host.append(card);
  });
}

function selectProperty(id) {
  const row = properties.find(item => item.id === id);
  if (!row) return startNew();
  cleanupDraftUrls();
  selectedId = row.id;
  galleryDraft = normalizeGallery(row).map(photo => ({ ...photo }));
  setForm(row);
  $("editor-title").textContent = "Editar imóvel";
  $("editor-subtitle").textContent = row.title || "Altere os dados e salve.";
  $("delete-property").disabled = false;
  renderGallery();
  renderList();
}

function startNew() {
  cleanupDraftUrls();
  galleryDraft = [];
  selectedId = null;
  $("property-form").reset();
  $("status").value = "available";
  $("date-listed").value = new Date().toISOString().slice(0, 10);
  $("editor-title").textContent = "Novo imóvel";
  $("editor-subtitle").textContent = "Preencha os dados para criar um anúncio.";
  $("delete-property").disabled = true;
  renderGallery();
  renderList();
}

async function compressPhoto(file) {
  if (!file.type.startsWith("image/")) throw new Error(file.name + " não é uma imagem.");
  const bitmap = await createImageBitmap(file);
  const maxEdge = 1800;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Não foi possível preparar a foto.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(result => result ? resolve(result) : reject(new Error("Falha ao comprimir a imagem.")), "image/jpeg", 0.82);
  });
  if (blob.size > 5 * 1024 * 1024) throw new Error("A foto comprimida ainda excede 5 MB.");
  return blob;
}

async function uploadPhoto(file, propertyId, alt) {
  const blob = await compressPhoto(file);
  const path = propertyId + "/" + crypto.randomUUID() + ".jpg";
  const { error } = await supabase.storage
    .from("property-photos")
    .upload(path, blob, { cacheControl: "31536000", contentType: "image/jpeg", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("property-photos").getPublicUrl(path);
  return { src: data.publicUrl, alt: alt || file.name };
}

async function saveProperty(event) {
  event.preventDefault();
  if (busy) return;
  const title = $("title").value.trim();
  if (!title) {
    showMessage("dashboard-message", "Informe o nome do imóvel.", "error");
    return;
  }

  busy = true;
  $("save-property").disabled = true;
  $("save-property").textContent = "Salvando...";
  try {
    const old = properties.find(item => item.id === selectedId);
    const id = selectedId || crypto.randomUUID();
    const gallery = [];

    for (const photo of galleryDraft) {
      if (photo.file) gallery.push(await uploadPhoto(photo.file, id, photo.alt));
      else if (photo.src) gallery.push({ src: photo.src, alt: photo.alt || "Foto do imóvel" });
    }

    const status = validStatus($("status").value);
    const slug = old?.slug || uniqueSlug(title, id);
    const record = {
      id,
      slug,
      title,
      price: numberOrNull($("price").value),
      status,
      neighborhood: $("neighborhood").value.trim(),
      address: old?.address || "",
      bedrooms: numberOrNull($("bedrooms").value),
      bathrooms: numberOrNull($("bathrooms").value),
      area: $("area").value.trim(),
      features: $("features").value.trim(),
      description: $("description").value.trim(),
      badge: $("badge").value.trim() || null,
      is_demo: $("is-demo").checked || status === "demo",
      image: gallery[0]?.src || "",
      gallery,
      date_listed: dateOrNull($("date-listed").value),
      available_from: dateOrNull($("available-from").value),
      whatsapp_message: $("whatsapp-message").value.trim() || null,
      photo_credit: old?.photo_credit || null,
      photo_source: old?.photo_source || null,
      page_path: "imovel.html?slug=" + encodeURIComponent(slug),
      sort_order: old?.sort_order ?? properties.length,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from("properties").upsert(record, { onConflict: "id" });
    if (error) throw error;

    showMessage("dashboard-message", "Imóvel salvo no Supabase. O catálogo público será atualizado automaticamente.", "success");
    selectedId = id;
    await loadProperties();
  } catch (error) {
    console.error(error);
    showMessage("dashboard-message", "Não foi possível salvar o imóvel: " + (error?.message || String(error)), "error");
  } finally {
    busy = false;
    $("save-property").disabled = false;
    $("save-property").textContent = "Salvar imóvel";
  }
}

async function deleteProperty() {
  if (!selectedId || busy) return;
  const item = properties.find(row => row.id === selectedId);
  if (!item || !confirm("Excluir definitivamente o anúncio '" + item.title + "'? As fotos já enviadas ao Storage não serão removidas automaticamente.")) return;

  busy = true;
  $("delete-property").disabled = true;
  try {
    const { error } = await supabase.from("properties").delete().eq("id", selectedId);
    if (error) throw error;
    selectedId = null;
    showMessage("dashboard-message", "Anúncio excluído do catálogo.", "success");
    await loadProperties();
  } catch (error) {
    showMessage("dashboard-message", "Falha ao excluir: " + error.message, "error");
  } finally {
    busy = false;
    $("delete-property").disabled = !selectedId;
  }
}

async function uploadLegacyDataUrl(src, propertyId, index, alt) {
  const response = await fetch(src);
  if (!response.ok) throw new Error("Não foi possível ler uma imagem do catálogo antigo.");
  const rawBlob = await response.blob();
  const file = new File([rawBlob], "foto-" + index + ".jpg", { type: rawBlob.type || "image/jpeg" });
  return uploadPhoto(file, propertyId, alt);
}

async function importLegacyCatalog() {
  if (busy) return;
  if (!confirm("Importar ou atualizar os imóveis de imoveis.json no Supabase? Registros com o mesmo ID serão atualizados; os demais não serão apagados. As imagens base64 serão enviadas ao Storage.")) return;

  busy = true;
  $("import-legacy").disabled = true;
  showMessage("dashboard-message", "Lendo o catálogo antigo...", "");
  try {
    const response = await fetch("imoveis.json?import=" + Date.now(), { cache: "no-store" });
    if (!response.ok) throw new Error("Não foi possível baixar imoveis.json (HTTP " + response.status + ").");
    const sourceRows = await response.json();
    if (!Array.isArray(sourceRows)) throw new Error("O arquivo imoveis.json não contém uma lista de imóveis.");

    const slugSet = new Set();
    const records = [];
    for (let rowIndex = 0; rowIndex < sourceRows.length; rowIndex++) {
      const source = sourceRows[rowIndex] || {};
      const id = String(source.id || crypto.randomUUID());
      const title = String(source.title || "Imóvel sem título");
      const originalSlug = slugify(source.slug || title);
      let slug = originalSlug;
      let suffix = 2;
      while (slugSet.has(slug)) slug = originalSlug + "-" + suffix++;
      slugSet.add(slug);

      const sourceGallery = Array.isArray(source.gallery) ? source.gallery : [];
      const normalized = sourceGallery.length
        ? sourceGallery.map((item, index) => typeof item === "string"
          ? { src: item, alt: "Foto " + (index + 1) + " de " + title }
          : { src: item?.src || "", alt: item?.alt || "Foto " + (index + 1) + " de " + title })
        : (source.image ? [{ src: source.image, alt: "Foto de " + title }] : []);

      const gallery = [];
      for (let photoIndex = 0; photoIndex < normalized.length; photoIndex++) {
        const photo = normalized[photoIndex];
        if (!photo.src) continue;
        let src = photo.src;
        if (/^data:image\//i.test(src)) {
          const uploaded = await uploadLegacyDataUrl(src, id, photoIndex + 1, photo.alt);
          src = uploaded.src;
        } else if (!/^(https?:|blob:)/i.test(src)) {
          src = new URL(src.replace(/^\/+/, ""), location.href).href;
        }
        gallery.push({ src, alt: photo.alt });
      }

      const status = validStatus(source.status);
      const isDemo = Boolean(source.demo) || status === "demo";
      records.push({
        id,
        slug,
        title,
        price: numberOrNull(source.price),
        status,
        neighborhood: source.neighborhood || "",
        address: source.address || "",
        bedrooms: numberOrNull(source.bedrooms),
        bathrooms: numberOrNull(source.bathrooms),
        area: source.area || "",
        features: source.features || "",
        description: source.description || "",
        badge: source.badge || null,
        is_demo: isDemo,
        image: gallery[0]?.src || "",
        gallery,
        date_listed: dateOrNull(source.dateListed || source.date_listed),
        available_from: dateOrNull(source.availableFrom || source.available_from),
        whatsapp_message: source.whatsappMessage || source.whatsapp_message || null,
        photo_credit: source.photoCredit || source.photo_credit || null,
        photo_source: source.photoSource || source.photo_source || null,
        page_path: "imovel.html?slug=" + encodeURIComponent(slug),
        sort_order: rowIndex
      });

      showMessage("dashboard-message", "Preparando " + (rowIndex + 1) + " de " + sourceRows.length + " imóveis e fotografias...", "");
    }

    for (let start = 0; start < records.length; start += 50) {
      const { error } = await supabase.from("properties").upsert(records.slice(start, start + 50), { onConflict: "id" });
      if (error) throw error;
    }

    showMessage("dashboard-message", records.length + " imóvel(is) importado(s)/atualizado(s). O arquivo imoveis.json foi preservado como backup.", "success");
    selectedId = null;
    await loadProperties();
  } catch (error) {
    console.error(error);
    showMessage("dashboard-message", "A importação foi interrompida. O arquivo do GitHub não foi alterado. Detalhe: " + (error?.message || String(error)), "error");
    await loadProperties();
  } finally {
    busy = false;
    $("import-legacy").disabled = false;
  }
}

$("login-form").addEventListener("submit", async event => {
  event.preventDefault();
  const email = $("login-email").value.trim();
  const password = $("login-password").value;
  if (!email || !password) return;

  $("login-button").disabled = true;
  $("login-button").textContent = "Entrando...";
  showMessage("login-message", "", "");
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // A sessão é tratada pelo listener onAuthStateChange abaixo.
  } catch (error) {
    const message = error?.message || "Confira o e-mail e a senha e tente novamente.";
    showMessage("login-message", "Não foi possível entrar: " + message, "error");
  } finally {
    $("login-button").disabled = false;
    $("login-button").textContent = "Entrar";
  }
});

$("copy-admin-sql").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("admin-sql").textContent);
    showMessage("setup-message", "SQL copiado. Execute-o no SQL Editor e depois clique em atualizar.", "success");
  } catch (_) {
    showMessage("setup-message", "Selecione e copie manualmente o SQL exibido acima.", "error");
  }
});

$("check-admin").addEventListener("click", () => handleSession(session));
$("sign-out").addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) showMessage("dashboard-message", "Não foi possível sair: " + error.message, "error");
});
$("new-property").addEventListener("click", startNew);
$("clear-form").addEventListener("click", startNew);
$("property-form").addEventListener("submit", saveProperty);
$("delete-property").addEventListener("click", deleteProperty);
$("import-legacy").addEventListener("click", importLegacyCatalog);

$("photo-files").addEventListener("change", event => {
  const files = Array.from(event.target.files || []);
  files.forEach(file => {
    const localUrl = URL.createObjectURL(file);
    galleryDraft.push({ src: localUrl, alt: file.name.replace(/\.[^.]+$/, ""), file, localUrl });
  });
  renderGallery();
  event.target.value = "";
});

const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
  Promise.resolve().then(() => handleSession(nextSession));
});

const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
if (sessionError) showMessage("login-message", "Falha ao verificar a sessão: " + sessionError.message, "error");
await handleSession(sessionData?.session || null);
