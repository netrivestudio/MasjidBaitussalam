// ===============================
// LOAD DATA
// ===============================
let data = JSON.parse(localStorage.getItem("baitussalamData")) || [];

// ===============================
// SIMPAN DATA
// ===============================
function simpanData() {
  localStorage.setItem("baitussalamData", JSON.stringify(data));
}

// ===============================
// TAMBAH DATA
// ===============================
function tambahData() {
  const tanggal = document.getElementById("tanggal").value;
  const jenis = document.getElementById("jenis").value;
  const jumlah = parseInt(document.getElementById("jumlah").value) || 0;
  const keterangan = document.getElementById("keterangan").value.trim();

  if (!tanggal || jumlah <= 0) {
    alert("Lengkapi data dengan benar!");
    return;
  }

  data.push({ tanggal, jenis, jumlah, keterangan });
  simpanData();
  renderTable();
  updateInfo();

  document.getElementById("jumlah").value = "";
  document.getElementById("keterangan").value = "";
}

// ===============================
// RENDER TABEL
// ===============================
function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.jenis}</td>
      <td>Rp ${item.jumlah.toLocaleString("id-ID")}</td>
      <td>${item.keterangan}</td>
      <td><button onclick="hapusBaris(${index})">Hapus</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// ===============================
// HAPUS BARIS
// ===============================
function hapusBaris(index) {
  data.splice(index, 1);
  simpanData();
  renderTable();
  updateInfo();
}

// ===============================
// HAPUS SEMUA
// ===============================
function hapusSemua() {
  if (!confirm("Yakin ingin menghapus semua data?")) return;
  data = [];
  simpanData();
  renderTable();
  updateInfo();
}

// ===============================
// HITUNG TOTAL
// ===============================
function updateInfo() {
  let totalMasuk = 0;
  let totalKeluar = 0;

  data.forEach(item => {
    if (item.jenis === "Pemasukan") totalMasuk += item.jumlah;
    else totalKeluar += item.jumlah;
  });

  document.getElementById("totalMasuk").textContent =
    totalMasuk.toLocaleString("id-ID");

  document.getElementById("totalKeluar").textContent =
    totalKeluar.toLocaleString("id-ID");

  document.getElementById("saldoAkhir").textContent =
    (totalMasuk - totalKeluar).toLocaleString("id-ID");
}

// ===============================
// EXPORT PDF (RAPIH ALA MINUMO)
// ===============================
function exportPDF() {
  if (data.length === 0) {
    alert("Data masih kosong!");
    return;
  }

  const doc = new window.jspdf.jsPDF("p", "mm", "a4");

  let totalMasuk = 0;
  let totalKeluar = 0;

  data.forEach(item => {
    if (item.jenis === "Pemasukan") totalMasuk += item.jumlah;
    else totalKeluar += item.jumlah;
  });

  const saldoAkhir = totalMasuk - totalKeluar;

  // HEADER
  doc.setFontSize(16);
  doc.text("Takmir Masjid Baitussalam", 14, 15);

  doc.setFontSize(10);
  doc.text(`Laporan Keuangan`, 14, 22);
  doc.text(`Export: ${new Date().toLocaleString("id-ID")}`, 14, 28);

  // TABEL
  doc.autoTable({
    startY: 35,
    head: [[
      "No", "Tanggal", "Jenis", "Jumlah (Rp)", "Keterangan"
    ]],
    body: data.map((item, i) => ([
      i + 1,
      item.tanggal,
      item.jenis,
      item.jumlah.toLocaleString("id-ID"),
      item.keterangan
    ])),
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: {
      fillColor: [33, 150, 243],
      textColor: 255,
      fontStyle: "bold"
    },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // RINGKASAN
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 4,
    theme: "plain",
    styles: { fontSize: 11, cellPadding: 1 },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: "bold" },
      1: { cellWidth: 5, halign: "center" },
      2: { cellWidth: 60 }
    },
    body: [
      ["Total Pemasukan", ":", `Rp ${totalMasuk.toLocaleString("id-ID")}`],
      ["Total Pengeluaran", ":", `Rp ${totalKeluar.toLocaleString("id-ID")}`],
      ["Saldo Akhir", ":", `Rp ${saldoAkhir.toLocaleString("id-ID")}`]
    ]
  });

  doc.save("Laporan_Takmir_Baitussalam.pdf");
}

// ===============================
renderTable();
updateInfo();
