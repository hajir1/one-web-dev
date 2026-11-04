import type { GeneratedFile } from "../../core/ui/CodeExportPanel";
import type { CollectionDef, CollectionField } from "../collections";
import { collectionsScript, crudNames, isNumeric, searchFields, seedRow, tableFields, type CrudNames } from "./common";

/* ================================================================== */
/* CRUD Laravel per koleksi                                              */
/*                                                                    */
/* Model, Migration, FormRequest, Controller admin (search + paginate),  */
/* API controller (used by the public pages), Seeder, Blade admin views, */
/* and routes. Login uses Laravel's built-in auth (Breeze starter kit): */
/* every admin route sits behind the `auth` middleware.                */
/* ================================================================== */

const php = (s: string) => `'${s.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;

/** Text inside PHP/JS comments. */
const cmt = (s: string) => s.replace(/\*\//g, "* /").replace(/[\r\n]+/g, " ");

/** Text that is safe in a Blade view (HTML + no Blade syntax). */
const bt = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/@/g, "&#64;").replace(/\{/g, "&#123;");

function phpValue(v: string | number | null): string {
  if (v === null) return "null";
  return typeof v === "number" ? String(v) : php(v);
}

function column(f: CollectionField): string {
  switch (f.type) {
    case "text":
      return `$table->string(${php(f.key)}, 160)${f.required ? "" : "->nullable()"};`;
    case "textarea":
      return `$table->text(${php(f.key)})->nullable();`;
    case "label":
      return `$table->string(${php(f.key)}, 30)->nullable();`;
    case "category":
      return `$table->string(${php(f.key)}, 40)->nullable()->index();`;
    case "image":
      // Text: an upload path (storage), an asset path, a URL, or a data URI from the template.
      return `$table->text(${php(f.key)})->nullable();`;
    case "price":
      return f.required ? `$table->unsignedBigInteger(${php(f.key)});` : `$table->unsignedBigInteger(${php(f.key)})->nullable();`;
    case "number":
      return `$table->unsignedInteger(${php(f.key)})->default(0);`;
    case "rating":
      return `$table->decimal(${php(f.key)}, 2, 1)->default(0);`;
  }
}

function rule(f: CollectionField): string {
  const req = f.required ? "'required'" : "'nullable'";
  switch (f.type) {
    case "text":
      return `[${req}, 'string', 'max:160']`;
    case "textarea":
      return `[${req}, 'string', 'max:2000']`;
    case "label":
      return `[${req}, 'string', 'max:30']`;
    case "category":
      return `[${req}, 'string', 'max:40']`;
    case "image":
      return `['nullable', 'image', 'max:2048']`;
    case "price":
      return f.key === "compare_price" ? `['nullable', 'integer', 'min:0', 'gt:price']` : `[${req}, 'integer', 'min:0']`;
    case "number":
      return `['nullable', 'integer', 'min:0']`;
    case "rating":
      return `['nullable', 'numeric', 'between:0,5']`;
  }
}

const cast = (f: CollectionField) => (f.type === "rating" ? "'decimal:1'" : f.type === "price" || f.type === "number" ? "'integer'" : null);

function model(c: CollectionDef, n: CrudNames): string {
  const casts = c.fields.map((f) => [f.key, cast(f)] as const).filter(([, v]) => v);
  const search = searchFields(c);
  return `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Builder;
use Illuminate\\Database\\Eloquent\\Model;

/** Koleksi "${cmt(c.name)}" (dibuat OneWebDev). */
class ${n.model} extends Model
{
    protected $table = ${php(n.table)};

    protected $fillable = [${c.fields.map((f) => php(f.key)).join(", ")}];

    protected function casts(): array
    {
        return [
${casts.map(([k, v]) => `            ${php(k)} => ${v},`).join("\n")}
        ];
    }

    /** Cari di ${search.join(", ")}. */
    public function scopeSearch(Builder $query, string $term): Builder
    {
        $term = trim($term);
        if ($term === '') {
            return $query;
        }
        $like = '%'.addcslashes($term, '%_\\\\').'%';

        return $query->where(function (Builder $w) use ($like) {
${search.map((k, i) => `            $w->${i ? "orWhere" : "where"}(${php(k)}, 'like', $like);`).join("\n")}
        });
    }

    /** Image URL: upload (public disk), site asset path, URL, or data URI. */
    public function getImageUrlAttribute(): ?string
    {
        $v = (string) ($this->image ?? '');
        if ($v === '') {
            return null;
        }
        if (preg_match('#^(https?://|data:image/|/)#i', $v)) {
            return $v;
        }
        if (str_starts_with($v, 'assets/')) {
            return asset($v);
        }

        // Uploads in storage/app/public (needs php artisan storage:link).
        return asset('storage/'.ltrim($v, '/'));
    }

    /** Bentuk data untuk kartu di halaman publik (GET /api/${n.slug}). */
    public function toCard(): array
    {
        return [
            'id' => $this->id,
${c.fields.filter((f) => f.type !== "image").map((f) => `            ${php(f.key)} => $this->${f.key},`).join("\n")}
            'image_url' => $this->image_url,
        ];
    }
}
`;
}

function migration(c: CollectionDef, n: CrudNames): string {
  const search = searchFields(c).filter((k) => c.fields.find((f) => f.key === k)?.type !== "textarea");
  return `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(${php(n.table)}, function (Blueprint $table) {
            $table->id();
${c.fields.map((f) => `            ${column(f)}`).join("\n")}
            $table->timestamps();
${search.length ? `\n            $table->index(${php(search[0])});` : ""}
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(${php(n.table)});
    }
};
`;
}

function request(c: CollectionDef, n: CrudNames): string {
  const prices = c.fields.filter((f) => f.type === "price").map((f) => f.key);
  const zero = c.fields.filter((f) => f.type === "number" || f.type === "rating").map((f) => f.key);
  return `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class ${n.model}Request extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** "Rp95.000" / "95.000" → 95000; empty number field → 0. */
    protected function prepareForValidation(): void
    {
        $clean = [];
        foreach (${`[${prices.map(php).join(", ")}]`} as $key) {
            $v = $this->input($key);
            $digits = preg_replace('/\\D/', '', (string) $v);
            // Empty → null; text without digits is left as is so the integer rule rejects it.
            $clean[$key] = $digits === '' ? (($v === null || $v === '') ? null : $v) : (int) $digits;
        }
        foreach (${`[${zero.map(php).join(", ")}]`} as $key) {
            $v = $this->input($key);
            $clean[$key] = ($v === null || $v === '') ? 0 : str_replace(',', '.', (string) $v);
        }
        $this->merge($clean);
    }

    public function rules(): array
    {
        return [
${c.fields.map((f) => `            ${php(f.key)} => ${rule(f)},`).join("\n")}
        ];
    }

    public function attributes(): array
    {
        return [
${c.fields.map((f) => `            ${php(f.key)} => ${php(f.label.toLowerCase())},`).join("\n")}
        ];
    }
}
`;
}

function adminController(c: CollectionDef, n: CrudNames): string {
  const hasImage = c.fields.some((f) => f.type === "image");
  return `<?php

namespace App\\Http\\Controllers\\Admin;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\${n.model}Request;
use App\\Models\\${n.model};
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\Http\\Request;${hasImage ? "\nuse Illuminate\\Support\\Facades\\Storage;" : ""}
use Illuminate\\View\\View;

/** Dashboard CRUD "${cmt(c.name)}": daftar + cari + pagination, tambah, ubah, hapus. */
class ${n.model}Controller extends Controller
{
    private const PER_PAGE = [10, 25, 50];

    public function index(Request $request): View
    {
        $q = trim((string) $request->query('q', ''));
        $perPage = (int) $request->query('per_page', 10);
        $perPage = in_array($perPage, self::PER_PAGE, true) ? $perPage : 10;

        $items = ${n.model}::query()
            ->search($q)
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();

        return view('admin.${n.slug}.index', [
            'items' => $items,
            'q' => $q,
            'perPage' => $perPage,
            'perPageOptions' => self::PER_PAGE,
        ]);
    }

    public function create(): View
    {
        return view('admin.${n.slug}.create', ['item' => new ${n.model}()]);
    }

    public function store(${n.model}Request $request): RedirectResponse
    {
        $data = $request->validated();${hasImage ? "\n        $data['image'] = $this->storeImage($request);" : ""}
        ${n.model}::create($data);

        return redirect()->route('admin.${n.slug}.index')->with('status', ${php(`${c.name} ditambahkan.`)});
    }

    public function edit(${n.model} $item): View
    {
        return view('admin.${n.slug}.edit', ['item' => $item]);
    }

    public function update(${n.model}Request $request, ${n.model} $item): RedirectResponse
    {
        $data = $request->validated();${
          hasImage
            ? `
        if ($path = $this->storeImage($request)) {
            $this->deleteImage($item->image);
            $data['image'] = $path;
        } else {
            unset($data['image']);
        }`
            : ""
        }
        $item->update($data);

        return redirect()->route('admin.${n.slug}.index')->with('status', ${php(`${c.name} diperbarui.`)});
    }

    public function destroy(${n.model} $item): RedirectResponse
    {${hasImage ? "\n        $this->deleteImage($item->image);" : ""}
        $item->delete();

        return back()->with('status', ${php(`${c.name} dihapus.`)});
    }${
      hasImage
        ? `

    private function storeImage(Request $request): ?string
    {
        return $request->hasFile('image') ? $request->file('image')->store(${php(n.slug)}, 'public') : null;
    }

    /** Only uploads on the public disk are deleted (not URLs / assets / data URIs). */
    private function deleteImage(?string $path): void
    {
        if ($path && ! preg_match('#^(https?://|data:|/|assets/)#i', $path)) {
            Storage::disk('public')->delete($path);
        }
    }`
        : ""
    }
}
`;
}

function apiController(c: CollectionDef, n: CrudNames): string {
  return `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\${n.model};
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

/** Data publik "${cmt(c.name)}" untuk halaman situs: GET /api/${n.slug}?q=&page=&per_page= */
class ${n.model}ApiController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $perPage = max(1, min(100, (int) $request->query('per_page', 12)));
        $page = ${n.model}::query()
            ->search((string) $request->query('q', ''))
            ->orderBy('id')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json([
            'data' => $page->getCollection()->map->toCard()->values(),
            'meta' => [
                'page' => $page->currentPage(),
                'per_page' => $page->perPage(),
                'total' => $page->total(),
                'last_page' => $page->lastPage(),
            ],
        ]);
    }
}
`;
}

function seeder(c: CollectionDef, n: CrudNames): string {
  const rows = c.items.map((it) => seedRow(c, it.values));
  return `<?php

namespace Database\\Seeders;

use App\\Models\\${n.model};
use Illuminate\\Database\\Seeder;

/** Data awal "${cmt(c.name)}" dari desain (${rows.length} baris). */
class ${n.model}Seeder extends Seeder
{
    public function run(): void
    {
        $rows = [
${rows.map((r) => `            [${Object.entries(r).map(([k, v]) => `${php(k)} => ${phpValue(v)}`).join(", ")}],`).join("\n")}
        ];

        foreach ($rows as $row) {
            ${n.model}::updateOrCreate([${php(c.fields[0]?.key ?? "name")} => $row[${php(c.fields[0]?.key ?? "name")}]], $row);
        }
    }
}
`;
}

/* ------------------------------- view ------------------------------- */

function adminLayout(cols: CrudNames[], siteName: string): string {
  return `<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>@yield('title') · Dashboard</title>
  <link rel="stylesheet" href="{{ asset('assets/admin.css') }}" />
</head>
<body class="adm">
  <aside class="adm-side">
    <a class="adm-brand" href="{{ url('/') }}">${bt(siteName)}</a>
    <nav>
${cols.map((n) => `      <a href="{{ route('admin.${n.slug}.index') }}" @class(['on' => request()->routeIs('admin.${n.slug}.*')])>${bt(n.label)}</a>`).join("\n")}
    </nav>
    @if (Route::has('logout'))
      <form method="POST" action="{{ route('logout') }}" class="adm-logout">
        @csrf
        <button type="submit">Keluar</button>
      </form>
    @endif
  </aside>
  <main class="adm-main">
    @if (session('status'))
      <div class="adm-flash" role="status">{{ session('status') }}</div>
    @endif
    @yield('content')
  </main>
</body>
</html>
`;
}

function indexView(c: CollectionDef, n: CrudNames): string {
  const cols = tableFields(c);
  const cell = (f: CollectionField) => {
    switch (f.type) {
      case "image":
        return `<td>@if ($item->image_url)<img class="adm-thumb" src="{{ $item->image_url }}" alt="">@endif</td>`;
      case "price":
        return `<td class="num">{{ $item->${f.key} ? 'Rp'.number_format($item->${f.key}, 0, ',', '.') : '–' }}</td>`;
      case "rating":
        return `<td class="num">{{ number_format((float) $item->${f.key}, 1) }}</td>`;
      case "label":
        return `<td>@if ($item->${f.key})<span class="adm-tag">{{ $item->${f.key} }}</span>@endif</td>`;
      default:
        return `<td>{{ $item->${f.key} }}</td>`;
    }
  };
  return `@extends('admin.layout')

@section('title', ${php(c.name)})

@section('content')
  <header class="adm-head">
    <h1>${bt(c.name)}</h1>
    <a class="adm-btn" href="{{ route('admin.${n.slug}.create') }}">+ Tambah ${bt(c.name.toLowerCase())}</a>
  </header>

  <form method="GET" class="adm-search" role="search">
    <input type="search" name="q" value="{{ $q }}" placeholder="Cari ${bt(c.name.toLowerCase())}…" aria-label="Cari" />
    <select name="per_page" aria-label="Baris per halaman" onchange="this.form.submit()">
      @foreach ($perPageOptions as $n)
        <option value="{{ $n }}" @selected($perPage === $n)>{{ $n }} / halaman</option>
      @endforeach
    </select>
    <button type="submit" class="adm-btn ghost">Cari</button>
  </form>

  <div class="adm-card">
    <table class="adm-table">
      <thead>
        <tr>
${cols.map((f) => `          <th${isNumeric(f) ? ' class="num"' : ""}>${bt(f.label)}</th>`).join("\n")}
          <th class="act">Aksi</th>
        </tr>
      </thead>
      <tbody>
        @forelse ($items as $item)
          <tr>
${cols.map((f) => `            ${cell(f)}`).join("\n")}
            <td class="act">
              <a href="{{ route('admin.${n.slug}.edit', $item) }}">Ubah</a>
              <form method="POST" action="{{ route('admin.${n.slug}.destroy', $item) }}" onsubmit="return confirm('Hapus data ini?')">
                @csrf
                @method('DELETE')
                <button type="submit" class="danger">Hapus</button>
              </form>
            </td>
          </tr>
        @empty
          <tr><td colspan="${cols.length + 1}" class="adm-empty">{{ $q !== '' ? 'Tidak ada hasil untuk "'.$q.'".' : 'Belum ada data.' }}</td></tr>
        @endforelse
      </tbody>
    </table>
  </div>

  @if ($items->total() > 0)
    <nav class="adm-pager" aria-label="Halaman">
      <span>{{ $items->firstItem() }}–{{ $items->lastItem() }} dari {{ $items->total() }}</span>
      <span class="adm-pages">
        @if ($items->onFirstPage())
          <span class="off">‹ Sebelumnya</span>
        @else
          <a href="{{ $items->previousPageUrl() }}" rel="prev">‹ Sebelumnya</a>
        @endif
        <span>Halaman {{ $items->currentPage() }} / {{ $items->lastPage() }}</span>
        @if ($items->hasMorePages())
          <a href="{{ $items->nextPageUrl() }}" rel="next">Berikutnya ›</a>
        @else
          <span class="off">Berikutnya ›</span>
        @endif
      </span>
    </nav>
  @endif
@endsection
`;
}

function formView(c: CollectionDef): string {
  const input = (f: CollectionField) => {
    const err = `@error(${php(f.key)})<small class="adm-err">{{ $message }}</small>@enderror`;
    const req = f.required ? " required" : "";
    const label = `<label for="f-${f.key}">${bt(f.label)}${f.required ? " *" : ""}</label>`;
    switch (f.type) {
      case "textarea":
        return `  <div class="adm-field">\n    ${label}\n    <textarea id="f-${f.key}" name="${f.key}" rows="4" maxlength="2000"${req}>{{ old(${php(f.key)}, $item->${f.key}) }}</textarea>\n    ${err}\n  </div>`;
      case "image":
        return `  <div class="adm-field">\n    ${label}\n    @if ($item->image_url)<img class="adm-thumb lg" src="{{ $item->image_url }}" alt="">@endif\n    <input id="f-${f.key}" type="file" name="${f.key}" accept="image/*" />\n    <small>JPG, PNG, atau WebP, maksimal 2 MB. Kosongkan untuk memakai gambar lama.</small>\n    ${err}\n  </div>`;
      case "price":
        return `  <div class="adm-field">\n    ${label}\n    <input id="f-${f.key}" type="number" name="${f.key}" min="0" step="1" inputmode="numeric" value="{{ old(${php(f.key)}, $item->${f.key}) }}"${req} />\n    ${err}\n  </div>`;
      case "number":
        return `  <div class="adm-field">\n    ${label}\n    <input id="f-${f.key}" type="number" name="${f.key}" min="0" step="1" value="{{ old(${php(f.key)}, $item->${f.key} ?? 0) }}" />\n    ${err}\n  </div>`;
      case "rating":
        return `  <div class="adm-field">\n    ${label}\n    <input id="f-${f.key}" type="number" name="${f.key}" min="0" max="5" step="0.1" value="{{ old(${php(f.key)}, $item->${f.key} ?? 0) }}" />\n    ${err}\n  </div>`;
      default:
        return `  <div class="adm-field">\n    ${label}\n    <input id="f-${f.key}" type="text" name="${f.key}" maxlength="${f.type === "label" ? 30 : 160}" value="{{ old(${php(f.key)}, $item->${f.key}) }}"${req} />\n    ${err}\n  </div>`;
    }
  };
  return `{{-- Shared form for create & edit. --}}
@csrf
<div class="adm-grid">
${c.fields.map(input).join("\n")}
</div>
`;
}

function createView(c: CollectionDef, n: CrudNames, edit: boolean): string {
  const hasImage = c.fields.some((f) => f.type === "image");
  return `@extends('admin.layout')

@section('title', ${php(`${edit ? "Ubah" : "Tambah"} ${c.name.toLowerCase()}`)})

@section('content')
  <header class="adm-head">
    <h1>${edit ? "Ubah" : "Tambah"} ${bt(c.name.toLowerCase())}</h1>
    <a class="adm-btn ghost" href="{{ route('admin.${n.slug}.index') }}">Kembali</a>
  </header>
  <form method="POST" action="{{ ${edit ? `route('admin.${n.slug}.update', $item)` : `route('admin.${n.slug}.store')`} }}" class="adm-card adm-form"${hasImage ? ' enctype="multipart/form-data"' : ""}>
    ${edit ? "@method('PUT')\n    " : ""}@include('admin.${n.slug}._form')
    <div class="adm-actions">
      <button type="submit" class="adm-btn">Simpan</button>
    </div>
  </form>
@endsection
`;
}

export const ADMIN_CSS = `/* CRUD dashboard (made by OneWebDev). No CSS framework. */
*,*::before,*::after{box-sizing:border-box}
body.adm{margin:0;display:flex;min-height:100vh;font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1c1917;background:#f5f5f4}
.adm-side{width:220px;flex-shrink:0;display:flex;flex-direction:column;gap:4px;padding:20px 12px;background:#1c1917;color:#e7e5e4}
.adm-brand{display:block;padding:4px 10px 16px;font-weight:700;font-size:16px;color:#fff;text-decoration:none}
.adm-side nav{display:flex;flex-direction:column;gap:2px}
.adm-side nav a{padding:8px 10px;border-radius:8px;color:#d6d3d1;text-decoration:none}
.adm-side nav a:hover,.adm-side nav a.on{background:#292524;color:#fff}
.adm-logout{margin-top:auto}
.adm-logout button{width:100%;padding:8px 10px;border:0;border-radius:8px;background:transparent;color:#a8a29e;text-align:left;cursor:pointer}
.adm-main{flex:1;min-width:0;padding:24px clamp(16px,3vw,40px)}
.adm-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}
.adm-head h1{margin:0;font-size:22px}
.adm-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border:1px solid #b45309;border-radius:8px;background:#b45309;color:#fff;font:inherit;font-weight:600;text-decoration:none;cursor:pointer}
.adm-btn.ghost{background:#fff;color:#b45309}
.adm-search{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.adm-search input{flex:1;min-width:180px}
input,select,textarea{width:100%;padding:9px 11px;border:1px solid #d6d3d1;border-radius:8px;background:#fff;font:inherit;color:inherit}
.adm-search select{width:auto}
.adm-card{background:#fff;border:1px solid #e7e5e4;border-radius:12px;overflow-x:auto}
.adm-table{width:100%;border-collapse:collapse;min-width:640px}
.adm-table th,.adm-table td{padding:10px 12px;border-bottom:1px solid #f5f5f4;text-align:left;vertical-align:middle}
.adm-table th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#78716c;background:#fafaf9}
.adm-table .num{text-align:right;font-variant-numeric:tabular-nums}
.adm-table .act{white-space:nowrap;text-align:right}
.adm-table .act a,.adm-table .act button{margin-left:10px;border:0;background:none;color:#b45309;font:inherit;font-weight:600;cursor:pointer;text-decoration:none}
.adm-table .act form{display:inline}
.adm-table .act .danger{color:#b91c1c}
.adm-thumb{width:44px;height:44px;border-radius:8px;object-fit:cover;background:#f5f5f4}
.adm-thumb.lg{width:96px;height:96px;display:block;margin-bottom:8px}
.adm-tag{display:inline-block;padding:2px 8px;border-radius:999px;background:#fef3c7;color:#92400e;font-size:12px;font-weight:600}
.adm-empty{padding:32px;text-align:center;color:#78716c}
.adm-pager{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin-top:12px;color:#57534e}
.adm-pages{display:flex;gap:14px;align-items:center}
.adm-pages a{color:#b45309;font-weight:600;text-decoration:none}
.adm-pages .off{color:#a8a29e}
.adm-flash{margin-bottom:16px;padding:10px 14px;border-radius:8px;background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0}
.adm-form{padding:20px}
.adm-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.adm-field{display:flex;flex-direction:column;gap:6px}
.adm-field label{font-weight:600}
.adm-field small{color:#78716c}
.adm-field .adm-err{color:#b91c1c}
.adm-actions{margin-top:20px;display:flex;gap:8px}
@media (max-width:720px){body.adm{flex-direction:column}.adm-side{width:auto;flex-direction:row;flex-wrap:wrap;align-items:center}.adm-side nav{flex-direction:row;flex-wrap:wrap}.adm-logout{margin:0 0 0 auto}.adm-brand{padding:4px 10px}}
`;

/** CRUD routes added to routes/web.php. */
export function laravelRoutes(cols: CollectionDef[]): string {
  const names = cols.map(crudNames);
  return `
/*
| Data collection CRUD (made by OneWebDev).
| /admin/* requires login (Laravel's built-in auth, e.g. the Breeze starter kit).
| /api/<collection> is used by the public pages to load cards from the database.
*/
${names.map((n) => `Route::get(${php(`/api/${n.slug}`)}, \\App\\Http\\Controllers\\Api\\${n.model}ApiController::class)->name(${php(`api.${n.slug}`)});`).join("\n")}

Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', fn () => redirect()->route(${php(`admin.${names[0]?.slug ?? "produk"}.index`)}))->name('dashboard');
${names.map((n) => `    Route::resource(${php(n.slug)}, \\App\\Http\\Controllers\\Admin\\${n.model}Controller::class)->except('show')->parameters([${php(n.slug)} => 'item']);`).join("\n")}
});

// Login/register routes from the Breeze starter kit (if installed).
if (file_exists(__DIR__.'/auth.php')) {
    require __DIR__.'/auth.php';
}
// Breeze redirects to the "dashboard" route after login: forward to /admin.
if (! Route::has('dashboard')) {
    Route::get('/dashboard', fn () => redirect('/admin'))->middleware('auth')->name('dashboard');
}
`;
}

/** Every Laravel CRUD file for the collection list. */
export function laravelCrudFiles(cols: CollectionDef[], siteName: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const names = cols.map(crudNames);
  cols.forEach((c, i) => {
    const n = names[i];
    const stamp = `2026_01_01_${String(100000 + i).padStart(6, "0")}`;
    files.push(
      { name: `app/Models/${n.model}.php`, lang: "php", content: model(c, n) },
      { name: `database/migrations/${stamp}_create_${n.table}_table.php`, lang: "php", content: migration(c, n) },
      { name: `app/Http/Requests/${n.model}Request.php`, lang: "php", content: request(c, n) },
      { name: `app/Http/Controllers/Admin/${n.model}Controller.php`, lang: "php", content: adminController(c, n) },
      { name: `app/Http/Controllers/Api/${n.model}ApiController.php`, lang: "php", content: apiController(c, n) },
      { name: `database/seeders/${n.model}Seeder.php`, lang: "php", content: seeder(c, n) },
      { name: `resources/views/admin/${n.slug}/index.blade.php`, lang: "php", content: indexView(c, n) },
      { name: `resources/views/admin/${n.slug}/_form.blade.php`, lang: "php", content: formView(c) },
      { name: `resources/views/admin/${n.slug}/create.blade.php`, lang: "php", content: createView(c, n, false) },
      { name: `resources/views/admin/${n.slug}/edit.blade.php`, lang: "php", content: createView(c, n, true) },
    );
  });
  files.push(
    { name: "resources/views/admin/layout.blade.php", lang: "php", content: adminLayout(names, siteName) },
    { name: "public/assets/admin.css", lang: "css", content: ADMIN_CSS },
    { name: "public/assets/collections.js", lang: "js", content: collectionsScript() },
  );
  return files;
}

export function laravelCrudReadme(cols: CollectionDef[]): string {
  const names = cols.map(crudNames);
  return `
## CRUD koleksi data

Paket ini sudah berisi CRUD untuk ${names.map((n) => `**${n.label}**`).join(", ")}: daftar dengan pencarian dan pagination, tambah, ubah, dan hapus, ditambah data awal dari desain. Langkah di bawah menggantikan bagian "Menjalankan" di atas.

### 1. Pasang PHP 8.2+ dan Composer (sekali saja)

Cara paling mudah:

- **Windows**: **Laravel Herd** (https://herd.laravel.com/windows) atau **Laragon** (https://laragon.org/download). Keduanya sudah berisi PHP dan Composer.
- **macOS**: **Laravel Herd** (https://herd.laravel.com), atau Homebrew: \`brew install php composer\`.
- **Linux**: ikuti https://laravel.com/docs/installation (perintah \`php.new\`), atau pasang \`php\`, \`php-sqlite3\`, \`php-xml\`, \`php-mbstring\`, \`php-curl\` lewat package manager lalu Composer dari https://getcomposer.org/download.

Tutup lalu buka lagi terminal, kemudian cek:

\`\`\`bash
php -v        # 8.2 atau lebih baru
composer -V
\`\`\`

### 2. Buat proyek Laravel, pasang login, salin isi zip

\`\`\`bash
composer create-project laravel/laravel situs
cd situs
# Admin login uses Laravel's built-in auth (skip if the project already has login)
composer require laravel/breeze --dev
php artisan breeze:install blade
\`\`\`

Lalu salin folder **\`app/\`, \`database/\`, \`resources/\`, \`public/\`, dan \`routes/\`** dari zip ini ke folder \`situs\`, timpa berkas yang sama (termasuk \`routes/web.php\`; rute login Breeze tetap dimuat otomatis).

### 3. Tabel, data awal, dan jalankan

\`\`\`bash
npm install && npm run build  # CSS halaman login Breeze (butuh Node.js: https://nodejs.org/en/download)
php artisan migrate
${names.map((n) => `php artisan db:seed --class=${n.model}Seeder`).join("\n")}
php artisan storage:link      # folder unggahan gambar
php artisan serve             # http://127.0.0.1:8000
\`\`\`

Daftar akun lewat \`/register\`, lalu buka **\`/admin\`**.

### Kalau ada masalah

| Gejala | Solusi |
|---|---|
| \`'php' is not recognized\` / \`composer: command not found\` | PHP/Composer belum terpasang, atau terminal belum dibuka ulang. |
| \`could not find driver\` saat migrate | Aktifkan ekstensi \`pdo_sqlite\` (atau driver database Anda) di \`php.ini\`. |
| \`Route [login] not defined\` | Breeze belum dipasang (langkah 2), jadi \`routes/auth.php\` belum ada. |
| \`419 Page Expired\` | Sesi habis. Muat ulang halaman form lalu kirim lagi. |
| Gambar unggahan tidak tampil | Jalankan \`php artisan storage:link\`. |

| Berkas | Isi |
|---|---|
${names
  .map(
    (n) =>
      `| \`app/Models/${n.model}.php\` | Model, scope \`search()\`, \`image_url\` |\n| \`app/Http/Controllers/Admin/${n.model}Controller.php\` | index (search + paginate), create, store, edit, update, destroy |\n| \`app/Http/Requests/${n.model}Request.php\` | Validasi form |\n| \`resources/views/admin/${n.slug}/\` | View Blade dashboard |\n| \`app/Http/Controllers/Api/${n.model}ApiController.php\` | \`GET /api/${n.slug}\` untuk halaman publik |`,
  )
  .join("\n")}

Halaman publik memuat \`public/assets/collections.js\`. Skrip ini mengisi ulang kartu di elemen \`[data-collection]\` dari \`/api/<koleksi>\`, jadi data yang diubah di dashboard langsung tampil. Bila koleksi diatur memakai pagination, tombol "Muat lagi", atau geser horizontal, skrip hanya memuat sebagian data per permintaan. Bila API tidak bisa diakses, kartu statis dari desain tetap tampil.

Rute CRUD ada di bagian bawah \`routes/web.php\`.
`;
}
