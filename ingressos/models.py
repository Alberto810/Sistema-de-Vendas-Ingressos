from django.db import models
import random
import string

class Categoria(models.Model):
    nome = models.CharField(max_length=50, unique=True)
    quantidade_disponivel = models.PositiveIntegerField(default=0)
    # 2º Ponto: Preço no admin (Padrão 25.00)
    preco = models.DecimalField(max_digits=6, decimal_places=2, default=25.00)

    def __str__(self):
        return self.nome
    
class Venda(models.Model):
    codigo = models.CharField(max_length=10, unique=True, blank=True)
    nome_cliente = models.CharField(max_length=100) # 1º Ponto: Nome completo
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name="vendas")
    idade_cliente = models.PositiveIntegerField()
    quantidade = models.PositiveIntegerField()
    valor_total = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    data_venda = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # 3.1 Ponto: Gera o código único automaticamente (Ex: CI-A9X2B)
        if not self.codigo:
            random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
            self.codigo = f'CI-{random_chars}'
        
        # Calcula o valor total antes de salvar
        if not self.valor_total or self.valor_total == 0:
            self.valor_total = self.quantidade * self.categoria.preco
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.codigo} - {self.quantidade} ingresso(s) - {self.categoria.nome}"