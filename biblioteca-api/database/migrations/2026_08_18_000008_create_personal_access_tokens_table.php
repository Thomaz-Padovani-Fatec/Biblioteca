<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Tabela onde o Laravel Sanctum guarda os tokens gerados no login (createToken).
// Esta é a mesma migration que o comando "php artisan install:api" publicaria.
// Ela está aqui pronta para não depender desse passo, e só cria a tabela se
// ela ainda não existir, evitando erro de tabela duplicada.
return new class extends Migration {
  public function up(): void
  {
    if (Schema::hasTable('personal_access_tokens')) {
      return;
    }

    Schema::create('personal_access_tokens', function (Blueprint $table) {
      $table->id();
      $table->morphs('tokenable');
      $table->text('name');
      $table->string('token', 64)->unique();
      $table->text('abilities')->nullable();
      $table->timestamp('last_used_at')->nullable();
      $table->timestamp('expires_at')->nullable()->index();
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('personal_access_tokens');
  }
};
