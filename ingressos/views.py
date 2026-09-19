import json
from django.shortcuts import render
from django.http import JsonResponse
from .models import Categoria, Venda

def home(request):
    categorias = Categoria.objects.all()
    # Enviamos os dados do banco para o JavaScript usar em tempo real
    categorias_dados = {
        cat.nome: {'disponivel': cat.quantidade_disponivel, 'preco': float(cat.preco)}
        for cat in categorias
    }
    context = {
        'categorias': categorias,
        'categorias_json': json.dumps(categorias_dados)
    }
    return render(request, 'ingressos/index.html', context)

def processar_compra(request):
    if request.method == 'POST':
        try:
            # Lendo os dados enviados pelo Fetch do JS
            data = json.loads(request.body)
            nome = data.get('nome_cliente', 'Não informado')
            idade = int(data.get('idade', 0))
            quantidade = int(data.get('quantidade', 1))

            if idade <= 12: nome_categoria = 'Criança'
            elif idade <= 17: nome_categoria = 'Adolescente'
            else: nome_categoria = 'Adulto'

            categoria = Categoria.objects.get(nome=nome_categoria)

            if categoria.quantidade_disponivel >= quantidade:
                categoria.quantidade_disponivel -= quantidade
                categoria.save()

                venda = Venda.objects.create(
                    nome_cliente=nome, categoria=categoria, 
                    idade_cliente=idade, quantidade=quantidade
                )
                
                return JsonResponse({
                    'sucesso': True,
                    'codigo': venda.codigo,
                    'categoria': categoria.nome,
                    'quantidade': quantidade,
                    'total': float(venda.valor_total)
                })
            else:
                return JsonResponse({'sucesso': False, 'erro': 'Quantidade indisponível.'})
        except Exception as e:
            return JsonResponse({'sucesso': False, 'erro': str(e)})
            
    return JsonResponse({'sucesso': False, 'erro': 'Método inválido'})

def buscar_ingresso(request, codigo):
    try:
        venda = Venda.objects.get(codigo=codigo.upper())
        return JsonResponse({
            'sucesso': True,
            'codigo': venda.codigo,
            'categoria': venda.categoria.nome,
            'quantidade': venda.quantidade,
            'total': float(venda.valor_total),
            'data': venda.data_venda.strftime('%d/%m/%Y %H:%M')
        })
    except Venda.DoesNotExist:
        return JsonResponse({'sucesso': False, 'erro': 'Ingresso não encontrado.'})