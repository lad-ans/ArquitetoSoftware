using System;
using FluentValidation.Results;
using MediatR;

namespace NerdStore.Core.Messages
{
    public class Command : Message, IRequest<bool>
    {
        public Command()
        {
            Timestamp = DateTime.Now;
        }

        public DateTime Timestamp { get; set; }
        public ValidationResult? ValidationResult { get; set; }

        public virtual bool EhValido()
        {
            throw new NotImplementedException();
        }
    }
}

