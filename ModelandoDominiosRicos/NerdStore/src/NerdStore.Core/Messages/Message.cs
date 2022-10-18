using System;
namespace NerdStore.Core.Messages
{
    public abstract class Message
    {
        protected Message()
        {
            MessageType = GetType().Name;
        }

        public string? MessageType { get; protected set; }
        public Guid AggregateId { get; protected set; }
    }
}

